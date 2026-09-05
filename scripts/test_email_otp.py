import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()
load_dotenv("backend/.env")

host = os.getenv("SMTP_HOST", "smtp.gmail.com")
port = int(os.getenv("SMTP_PORT", "587"))
user = os.getenv("SMTP_USER", "techsahaya.support@gmail.com")
password = os.getenv("SMTP_PASSWORD", "")
recipient = "kranbadsh@gmail.com"

print(f"Testing SMTP Dispatch from {user} to {recipient}...")
print(f"SMTP Host: {host}:{port}")
print(f"SMTP Password configured: {'YES (length: ' + str(len(password)) + ')' if password else 'NO (BLANK)'}")

if not password:
    print("\n[!] ERROR: SMTP_PASSWORD is blank in .env and backend/.env.")
    print("Google strictly requires a 16-character App Password when 2-Step Verification is enabled.")
    print("Steps to enable delivery:")
    print("1. Open https://myaccount.google.com/apppasswords while logged in as techsahaya.support@gmail.com")
    print("2. Type App name: TechSahaya")
    print("3. Click Create -> Copy the 16 characters (e.g. 'abcd efgh ijkl mnop')")
    print("4. Paste into .env at line 56: SMTP_PASSWORD=abcd efgh ijkl mnop")
    exit(1)

try:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "[749201] Your Tech Sahaya Verification Code"
    msg["From"] = f"Tech Sahaya Support <{user}>"
    msg["To"] = recipient

    text = "Tech Sahaya Verification Code: 749201\nValid for 5 minutes."
    html = """
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
      <div style="max-width: 500px; background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #064e3b; margin-top: 0;">Tech Sahaya Verification Code</h2>
        <p>Your 6-digit one-time passcode is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #064e3b; background: #ecfdf5; padding: 12px 20px; border-radius: 8px; text-align: center; margin: 16px 0;">
          749201
        </div>
        <p style="color: #64748b; font-size: 12px;">Valid for 5 minutes. Never share this code with anyone.</p>
      </div>
    </div>
    """
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(host, port, timeout=15) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(msg)

    print(f"\n[SUCCESS] Email successfully dispatched to {recipient}! Check your inbox now.")
except Exception as e:
    print(f"\n[FAILED] SMTP Exception: {e}")
