import hashlib
import logging
import os
import secrets
import smtplib
import ssl
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Tuple

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.db_models import OTPRecord
from app.services.email_validator import validate_email_address, EmailValidationError

logger = logging.getLogger("techsahaya.otp")

OTP_EXPIRY_MINUTES = 10
MAX_ATTEMPTS = 5
COOLDOWN_SECONDS = 60
MAX_SENDS_PER_HOUR = 10


def hash_otp_code(code: str) -> str:
    """Returns SHA-256 hex digest of the OTP string."""
    return hashlib.sha256(code.strip().encode("utf-8")).hexdigest()


class OTPService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def generate_numeric_otp(self) -> str:
        """Generates a cryptographically secure 6-digit numeric string using secrets."""
        return str(secrets.randbelow(900000) + 100000)

    def send_otp(self, db: Session, email_input: str) -> Tuple[bool, str, int, int]:
        """
        Phase 1 & Phase 2 & Phase 3:
        1. Validates syntax, blocks disposable domains, and verifies DNS MX records.
        2. Enforces per-email 60-second cooldown server-side.
        3. Generates cryptographically secure 6-digit code with secrets.randbelow.
        4. Hashes and stores code with 10-minute auto-expiry TTL and attempt counter.
        5. Dispatches email via Gmail SMTP.
        Returns: (email_dispatched: bool, message: str, cooldown_seconds: int, expires_in: int)
        NEVER returns the OTP code!
        """
        # Phase 1: Email Validation Gatekeeper
        try:
            clean_email = validate_email_address(email_input)
        except EmailValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=e.message,
            )

        now = datetime.utcnow()

        # Phase 2: Per-user isolated storage & cooldown enforcement
        record = db.query(OTPRecord).filter(OTPRecord.email == clean_email).first()

        if record:
            # Enforce 60-second cooldown
            if record.cooldown_until and now < record.cooldown_until:
                remaining_sec = max(1, int((record.cooldown_until - now).total_seconds()) + 1)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Please wait {remaining_sec} seconds before requesting a new code.",
                )

            # Check hourly rate limit
            if now - record.window_start < timedelta(hours=1):
                if record.send_count >= MAX_SENDS_PER_HOUR:
                    minutes_left = max(1, int(60 - (now - record.window_start).total_seconds() // 60))
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail=f"Rate limit exceeded: Maximum {MAX_SENDS_PER_HOUR} requests per hour. Please try again in {minutes_left} minutes.",
                    )
                record.send_count += 1
            else:
                record.window_start = now
                record.send_count = 1

            # Generate new OTP & update record with 10-min TTL
            raw_otp = self.generate_numeric_otp()
            record.hashed_otp = hash_otp_code(raw_otp)
            record.expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)
            record.attempts = 0
            record.verified = False
            record.last_sent_at = now
            record.cooldown_until = now + timedelta(seconds=COOLDOWN_SECONDS)
            record.created_at = now
        else:
            raw_otp = self.generate_numeric_otp()
            record = OTPRecord(
                email=clean_email,
                hashed_otp=hash_otp_code(raw_otp),
                expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
                attempts=0,
                send_count=1,
                window_start=now,
                last_sent_at=now,
                cooldown_until=now + timedelta(seconds=COOLDOWN_SECONDS),
                verified=False,
                created_at=now,
            )
            db.add(record)

        db.commit()

        # Phase 3: Dispatch transactional email via Gmail SMTP
        email_sent, dispatch_msg = self._dispatch_email(clean_email, raw_otp)
        return email_sent, dispatch_msg, COOLDOWN_SECONDS, OTP_EXPIRY_MINUTES * 60

    def verify_otp(self, db: Session, email_input: str, raw_otp: str) -> Tuple[bool, str]:
        """
        Verifies the user's OTP using constant-time digest comparison.
        Checks:
        - Record exists for specific user email
        - OTP not expired (10 min TTL)
        - Attempts count < MAX_ATTEMPTS (max 5 attempts before lockout)
        - Constant-time hash verification
        Returns: (success: bool, verification_token: str)
        """
        clean_email = email_input.strip().lower()
        clean_otp = raw_otp.strip()
        now = datetime.utcnow()

        record = db.query(OTPRecord).filter(OTPRecord.email == clean_email).first()
        if not record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No pending verification code found for this email address. Please request a new code.",
            )

        # Check maximum failed attempts (max 5 attempts lockout)
        if record.attempts >= MAX_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Maximum verification attempts (5) exceeded. For your security, this code is locked. Please request a new code.",
            )

        # Check 10-minute expiration
        if now > record.expires_at:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The verification code has expired (valid for 10 minutes). Please request a new code.",
            )

        # Constant-time comparison of hashed OTP
        provided_hash = hash_otp_code(clean_otp)
        is_valid = secrets.compare_digest(provided_hash, record.hashed_otp)

        if not is_valid:
            record.attempts += 1
            db.commit()
            remaining = max(0, MAX_ATTEMPTS - record.attempts)
            if remaining > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid verification code. {remaining} attempt{'s' if remaining != 1 else ''} remaining.",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Maximum verification attempts (5) exceeded. For your security, this code is now locked. Please request a new code.",
                )

        # Verification successful: reset attempts and mark verified
        record.verified = True
        record.attempts = 0
        db.commit()

        # Generate a temporary verification proof token
        verification_token = secrets.token_urlsafe(32)
        return True, verification_token

    def _dispatch_email(self, recipient_email: str, otp_code: str) -> Tuple[bool, str]:
        """
        Constructs and sends an official Tech Sahaya transactional security email
        via Gmail SMTP.
        """
        settings = get_settings()

        if not settings.smtp_password:
            logger.warning(
                "SMTP_PASSWORD is not configured in .env. To deliver real emails to inbox, "
                "set an App Password for techsahaya.support@gmail.com in .env."
            )
            return (
                False,
                "SMTP credentials not fully configured in environment. Set Gmail App Password in .env to deliver real emails.",
            )

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"[{otp_code}] Your Tech Sahaya Verification Code"
            msg["From"] = settings.smtp_from or f"Tech Sahaya Support <{settings.smtp_user}>"
            msg["To"] = recipient_email

            # Plain text alternative
            text_content = f"""
Tech Sahaya - Citizen Welfare Platform
Two-Step Verification Code

Your 6-digit verification code is: {otp_code}

This code is valid for 5 minutes.
For your security, never share this code with anyone. Tech Sahaya officers and operators will NEVER ask for your verification code.

If you did not request this code, you can safely ignore this email or contact our support team at techsahaya.support@gmail.com.

© 2026 Tech Sahaya Digital Public Infrastructure • Government of India
            """.strip()

            # Responsive, government-grade HTML design
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="580" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 28px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 4px 0; font-family: Georgia, serif;">Tech Sahaya</h1>
                    <p style="color: #6ee7b7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Digital Citizen Welfare Infrastructure</p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fef3c7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 20px;">
                      Official Auth
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size: 15px; line-height: 22px; color: #334155; margin: 0 0 16px 0;">
                Hello,
              </p>
              <p style="font-size: 15px; line-height: 22px; color: #334155; margin: 0 0 24px 0;">
                We received a request to access your <strong>Tech Sahaya</strong> citizen account. Please use the verification code below to complete your sign-in:
              </p>

              <!-- OTP Code Display Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 20px;">
                    <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #064e3b;">
                      {otp_code}
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #047857; margin-top: 6px;">
                      Valid for 5 minutes only
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <p style="font-size: 12px; font-weight: 700; color: #92400e; margin: 0 0 4px 0;">
                  Security Guidelines:
                </p>
                <p style="font-size: 12px; line-height: 18px; color: #78350f; margin: 0;">
                  Never share this code with anyone. Tech Sahaya staff, CSC operators, and government representatives will <strong>never</strong> ask for this code or your password.
                </p>
              </div>

              <p style="font-size: 13px; line-height: 20px; color: #64748b; margin: 0;">
                If you did not initiate this request, someone may be trying to access your account. Please change your password or reach out to us at <a href="mailto:techsahaya.support@gmail.com" style="color: #059669; font-weight: 600; text-decoration: underline;">techsahaya.support@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0;">
                Tech Sahaya • Ministry of Electronics and Information Technology • DPDP Act Compliant
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Support Email: <a href="mailto:techsahaya.support@gmail.com" style="color: #64748b;">techsahaya.support@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            """.strip()

            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            return self._send_smtp_payload(msg, recipient_email)

        except Exception as exc:
            logger.error("Failed to prepare OTP email for %s: %s", recipient_email, str(exc))
            return False, f"Email preparation error: {str(exc)}"

    def _send_smtp_payload(self, msg: MIMEMultipart, recipient_email: str) -> Tuple[bool, str]:
        """
        Sends an email message via Gmail SMTP with dual-port fallback (Port 587 STARTTLS -> Port 465 SSL).
        Uses explicit sendmail(from, to_addrs, raw_bytes) so the SMTP envelope recipient is always
        the intended address — NOT inferred from the To header (which send_message() relies on).
        Supports a single address string or a list of addresses.
        """
        settings = get_settings()
        pwd = (
            settings.smtp_password
            or getattr(settings, "gmail_app_password", None)
            or os.environ.get("SMTP_PASSWORD")
            or os.environ.get("GMAIL_APP_PASSWORD")
            or ""
        ).strip()
        usr = (
            settings.smtp_user
            or getattr(settings, "gmail_user", None)
            or os.environ.get("SMTP_USER")
            or os.environ.get("GMAIL_USER")
            or ""
        ).strip()

        if not pwd or not usr:
            logger.warning("SMTP credentials (SMTP_USER / SMTP_PASSWORD) are not configured in .env.")
            return False, "SMTP credentials not configured."

        # Normalize recipients: accept str or list, strip whitespace, drop empty strings
        if isinstance(recipient_email, list):
            to_addrs = [r.strip() for r in recipient_email if r.strip()]
        else:
            to_addrs = [r.strip() for r in recipient_email.split(",") if r.strip()]

        if not to_addrs:
            logger.error("No valid recipient addresses provided.")
            return False, "No valid recipient email address."

        raw_msg = msg.as_bytes()
        log_recipients = ", ".join(to_addrs)

        # Attempt 1: Port 587 STARTTLS
        try:
            server = smtplib.SMTP(settings.smtp_host, 587, timeout=10)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(usr, pwd)
            refused = server.sendmail(usr, to_addrs, raw_msg)  # explicit envelope recipients
            server.quit()
            if refused:
                logger.warning("Port 587: some recipients refused: %s", refused)
            logger.info("Dispatched via Port 587 STARTTLS to %s", log_recipients)
            return True, "Verification email successfully dispatched to your inbox."
        except Exception as e587:
            logger.warning("Port 587 STARTTLS failed (%s). Falling back to Port 465 SSL...", str(e587))

        # Attempt 2: Port 465 SSL
        try:
            context = ssl.create_default_context()
            server = smtplib.SMTP_SSL(settings.smtp_host, 465, context=context, timeout=10)
            server.login(usr, pwd)
            refused = server.sendmail(usr, to_addrs, raw_msg)  # explicit envelope recipients
            server.quit()
            if refused:
                logger.warning("Port 465: some recipients refused: %s", refused)
            logger.info("Dispatched via Port 465 SSL to %s", log_recipients)
            return True, "Verification email successfully dispatched to your inbox."
        except Exception as e465:
            logger.error("Both ports failed for %s: %s", log_recipients, str(e465))
            return False, f"SMTP dispatch error: {str(e465)}"

    def send_newsletter_subscription_email(self, recipient_email: str) -> Tuple[bool, str]:
        """
        Constructs and sends an official Tech Sahaya welfare scheme notification
        enrollment confirmation email via Gmail SMTP.
        """
        clean_email = recipient_email.strip().lower()
        subject = "Tech Sahaya - Official Welfare Scheme Updates Subscription Confirmed"
        
        text_body = f"""
Tech Sahaya - Digital Public Welfare Platform
Official Scheme Notification Subscription Confirmed

Dear Citizen,

Thank you for subscribing to official welfare updates on Tech Sahaya.
Your registered email ({clean_email}) is now enrolled to receive real-time notifications for:
- Newly launched Central and State welfare schemes
- Scheme eligibility criteria revisions and deadline alerts
- Direct Benefit Transfer (DBT) and subsidy disbursement schedules
- Document verification and DigiLocker checklist guides

To check your eligible schemes right now, visit: https://techsahaya.in/

Support Email: techsahaya.support@gmail.com
(C) 2026 Tech Sahaya Digital Public Infrastructure - Government of India
        """.strip()

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Subscription Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 28px 32px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 4px 0; font-family: Georgia, serif;">Tech Sahaya</h1>
              <p style="color: #6ee7b7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Official Welfare Scheme Updates</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #065f46;">
                  ✓ Notification Enrollment Successful
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857;">
                  You will receive real-time notifications for official government schemes at <strong>{clean_email}</strong>.
                </p>
              </div>
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">What you will receive:</h3>
              <ul style="font-size: 13px; line-height: 22px; color: #475569; padding-left: 20px; margin: 0 0 24px 0;">
                <li>Verified notifications for newly published Central and State welfare schemes</li>
                <li>Direct Benefit Transfer (DBT) schedule updates</li>
                <li>Eligibility criteria changes for farming, education, health, and livelihood programs</li>
                <li>Application deadline reminders with zero spam or third-party advertisements</li>
              </ul>
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://techsahaya.in/find-schemes" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">
                  Discover Eligible Schemes Now
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px 0;">
                Tech Sahaya - Digital Public Infrastructure - DPDP Act 2023 Compliant
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Support Email: <a href="mailto:techsahaya.support@gmail.com" style="color: #64748b;">techsahaya.support@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        """.strip()

        return self._send_custom_email(clean_email, subject, text_body, html_body)

    def send_scheme_application_email(
        self,
        recipient_email: str,
        scheme_name: str,
        applicant_name: str,
        application_id: str,
        official_link: str = "",
    ) -> Tuple[bool, str]:
        """
        Constructs and sends an official Tech Sahaya Scheme Application Confirmation
        email with application ID and next steps via Gmail SMTP.
        """
        clean_email = recipient_email.strip().lower()
        subject = f"[{application_id}] Application Registered: {scheme_name}"
        timestamp = datetime.utcnow().strftime("%d %B %Y, %I:%M %p UTC")

        text_body = f"""
Tech Sahaya - Citizen Welfare Application Confirmation

Application Reference: {application_id}
Scheme: {scheme_name}
Applicant Name: {applicant_name}
Submission Timestamp: {timestamp}

Dear {applicant_name},

Your official scheme application package for {scheme_name} has been verified and registered on Tech Sahaya.

Next Steps:
1. Retain your Application Reference Number ({application_id}) for tracking.
2. Official Portal Review: Your application details are being coordinated with the nodal department.
3. Verification & DBT: Upon district verification, benefits will be credited directly to your Aadhaar-linked bank account.

Official Scheme Portal: {official_link or 'https://techsahaya.in/'}

If you have any questions, reach out to us at techsahaya.support@gmail.com.

(C) 2026 Tech Sahaya Digital Public Infrastructure - Government of India
        """.strip()

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Registered</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 28px 32px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 4px 0; font-family: Georgia, serif;">Tech Sahaya</h1>
              <p style="color: #6ee7b7; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Official Welfare Application Registered</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; font-weight: 700; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.5px;">Application Reference</span>
                  <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 6px;">{application_id}</span>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: 700; color: #1e3a8a;">
                  {scheme_name}
                </p>
              </div>

              <table width="100%" style="border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 40%;">Applicant Name:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">{applicant_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Registered Email:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">{clean_email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Submission Timestamp:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">{timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Application Status:</td>
                  <td style="padding: 8px 0; font-weight: 700; color: #059669;">Submitted • Pending Department Verification</td>
                </tr>
              </table>

              <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Next Steps:</h3>
              <ol style="font-size: 12.5px; line-height: 20px; color: #475569; padding-left: 20px; margin: 0 0 24px 0;">
                <li>Your auto-filled data and verified eligibility certificates have been securely prepared.</li>
                <li>District nodal officers will review your household verification status.</li>
                <li>Upon sanction, eligible benefits will be disbursed via Direct Benefit Transfer (DBT).</li>
              </ol>

              {f'<div style="text-align: center; margin: 20px 0;"><a href="{official_link}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px;">Open Official Department Portal &rarr;</a></div>' if official_link else ''}
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px 0;">
                Tech Sahaya - Ministry of Electronics and Information Technology - DPDP Compliant
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Assistance: <a href="mailto:techsahaya.support@gmail.com" style="color: #64748b;">techsahaya.support@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        """.strip()

        return self._send_custom_email(clean_email, subject, text_body, html_body)

    def _send_custom_email(self, recipient_email: str, subject: str, text_content: str, html_content: str) -> Tuple[bool, str]:
        """Internal helper to dispatch formatted transactional emails to any recipient."""
        settings = get_settings()
        usr = (
            settings.smtp_user
            or getattr(settings, "gmail_user", None)
            or os.environ.get("SMTP_USER")
            or os.environ.get("GMAIL_USER")
            or ""
        ).strip()

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = settings.smtp_from or f"Tech Sahaya Support <{usr}>"
            msg["To"] = recipient_email  # header for display; envelope set explicitly in _send_smtp_payload

            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            return self._send_smtp_payload(msg, recipient_email)
        except Exception as exc:
            logger.error("Failed to prepare email to %s: %s", recipient_email, str(exc))
            return False, f"Email preparation error: {str(exc)}"


otp_service = OTPService()


def send_email(to: str, subject: str, body: str):
    """Standalone helper function matching standard FastAPI email pattern."""
    return otp_service._send_custom_email(to, subject, body, f"<html><body><p>{body}</p></body></html>")

