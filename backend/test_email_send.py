"""
Standalone SMTP diagnostic - tests delivery to any recipient email.
Run: venv/bin/python3 test_email_send.py
"""
import smtplib
import logging
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

GMAIL_USER = os.getenv("GMAIL_USER", "techsahaya.support@gmail.com")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

def send_test_email(to: str):
    print(f"\n{'='*60}")
    print(f"Attempting send to: {to}")
    print(f"From (GMAIL_USER): {GMAIL_USER}")
    print(f"App password set: {'YES (' + str(len(GMAIL_APP_PASSWORD)) + ' chars)' if GMAIL_APP_PASSWORD else 'NO - MISSING!'}")
    print(f"{'='*60}")

    msg = MIMEText("This is a Tech Sahaya test OTP: 999999\n\nIf you received this, email delivery to your address works correctly.")
    msg["Subject"] = "[999999] Tech Sahaya - Email Delivery Test"
    msg["From"] = f"Tech Sahaya Support <{GMAIL_USER}>"
    msg["To"] = to  # <-- this is the real recipient, NOT hardcoded

    # Attempt 1: Port 465 SSL
    print("\n[Attempt 1] Port 465 SSL...")
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.set_debuglevel(1)
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            refused = server.sendmail(GMAIL_USER, [to], msg.as_string())
            if refused:
                print(f"❌ SERVER REFUSED: {refused}")
            else:
                print(f"✅ Port 465: Server accepted for delivery to {to}")
            return
    except smtplib.SMTPRecipientsRefused as e:
        print(f"❌ RECIPIENT REFUSED (this is a real block): {e.recipients}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ AUTH FAILED - regenerate App Password: {e}")
    except Exception as e:
        print(f"❌ Port 465 error: {type(e).__name__}: {e}")

    # Attempt 2: Port 587 STARTTLS
    print("\n[Attempt 2] Port 587 STARTTLS...")
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        refused = server.sendmail(GMAIL_USER, [to], msg.as_string())
        server.quit()
        if refused:
            print(f"❌ SERVER REFUSED: {refused}")
        else:
            print(f"✅ Port 587: Server accepted for delivery to {to}")
    except smtplib.SMTPRecipientsRefused as e:
        print(f"❌ RECIPIENT REFUSED: {e.recipients}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ AUTH FAILED: {e}")
    except Exception as e:
        print(f"❌ Port 587 error: {type(e).__name__}: {e}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        test_addresses = sys.argv[1:]
    else:
        test_addresses = [
            GMAIL_USER,  # Test 1: self-send (should always work)
            "kranbadsh@gmail.com",  # Test 2: known account
        ]

    for addr in test_addresses:
        send_test_email(addr.strip())

    print("\n\nDone. Check your inboxes (and spam folders) for the test emails.")
