"""
Email Service — sends emails via Brevo (Sendinblue) API in a background thread.
Brevo is used because:
  - Gmail SMTP is silently dropped by cloud provider IPs (Render, Railway, etc.)
  - Resend free tier restricts delivery to the account owner's email only
  - Brevo free tier sends to ANY recipient, only requiring sender email verification
Gracefully handles missing API key (logs warning, never crashes).
"""

import threading
import logging
import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

SENDER_EMAIL = "try.meet.2427@gmail.com"
SENDER_NAME  = "Underseas Bank"


def email_is_configured() -> bool:
    """Return whether Brevo API key is present."""
    return bool(getattr(settings, "BREVO_API_KEY", None))


def _send_email(to_email: str, subject: str, html_body: str):
    """Internal: send email via Brevo HTTP API. Runs in background thread."""

    api_key = getattr(settings, "BREVO_API_KEY", None)

    if not api_key:
        logger.warning(
            f"BREVO_API_KEY not set — skipping email to {to_email}. "
            "Add BREVO_API_KEY to your Render environment variables."
        )
        print(f"📧 [EMAIL SKIPPED] To: {to_email} | Subject: {subject}")
        return

    try:
        response = httpx.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": api_key,
                "Content-Type": "application/json",
            },
            json={
                "sender":      {"name": SENDER_NAME, "email": SENDER_EMAIL},
                "to":          [{"email": to_email}],
                "subject":     subject,
                "htmlContent": html_body,
            },
            timeout=10,
        )
        response.raise_for_status()
        print(f"✅ [EMAIL SENT] To: {to_email} | Subject: {subject} | ID: {response.json().get('messageId')}")

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        print(f"❌ [EMAIL FAILED] To: {to_email} | Error: {e}")


def send_email_async(to_email: str, subject: str, html_body: str):
    """Send email in a background thread (non-blocking)."""
    thread = threading.Thread(
        target=_send_email,
        args=(to_email, subject, html_body),
        daemon=True,
    )
    thread.start()


def get_email_status() -> dict:
    """Expose Brevo configuration status for setup verification."""
    api_key = getattr(settings, "BREVO_API_KEY", "") or ""
    key_preview = f"{api_key[:6]}...{api_key[-4:]}" if len(api_key) > 10 else ("(empty)" if not api_key else "(too short)")
    return {
        "provider": "Brevo",
        "configured": email_is_configured(),
        "sender_email": SENDER_EMAIL,
        "brevo_key_preview": key_preview,
        "brevo_key_length": len(api_key),
    }


def test_brevo_connection() -> dict:
    """Make a live test call to Brevo and return the exact result — use for diagnostics."""
    api_key = getattr(settings, "BREVO_API_KEY", "") or ""
    if not api_key:
        return {"ok": False, "error": "BREVO_API_KEY is empty or not set"}
    try:
        resp = httpx.get(
            "https://api.brevo.com/v3/account",
            headers={"api-key": api_key},
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            return {
                "ok": True,
                "plan": data.get("plan", []),
                "email": data.get("email"),
            }
        return {"ok": False, "status": resp.status_code, "body": resp.text}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def send_welcome_email(to_email: str, user_name: str):
    """Send a beautiful HTML welcome email to a newly registered user."""

    subject = "Welcome to Underseas Bank"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f4f2ec;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f2ec; padding: 48px 20px;">
            <tr>
                <td align="center">
                    <table width="580" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e3ded0;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color: #0b2b2a; padding: 44px 44px 36px; text-align: left;">
                                <p style="color: #c9a24b; margin: 0 0 6px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; font-family: Georgia, serif;">
                                    Underseas Bank
                                </p>
                                <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 400; font-family: Georgia, serif; letter-spacing: 0.3px;">
                                    Your account is open.
                                </h1>
                            </td>
                        </tr>

                        <!-- Accent rule -->
                        <tr>
                            <td style="height: 4px; background-color: #c9a24b; line-height: 4px; font-size: 0;">&nbsp;</td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 44px 44px 8px; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                                <p style="color: #14181a; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">
                                    Dear {user_name},
                                </p>
                                <p style="color: #4a5259; font-size: 15px; line-height: 1.75; margin: 0 0 32px;">
                                    Thank you for choosing Underseas Bank. Your account has been created and is ready to use. Below is a short summary of what's included.
                                </p>

                                <!-- Feature list -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 36px;">
                                    <tr>
                                        <td style="padding: 18px 0; border-top: 1px solid #e8e5dc;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="28" style="vertical-align: top; color: #c9a24b; font-size: 15px; font-weight: 700;">01</td>
                                                   
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 18px 0; border-top: 1px solid #e8e5dc;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="28" style="vertical-align: top; color: #c9a24b; font-size: 15px; font-weight: 700;">02</td>
                                                    <td>
                                                        <strong style="color: #14181a; font-size: 14.5px;">Instant transfers</strong>
                                                        <p style="color: #75808a; font-size: 13.5px; margin: 4px 0 0; line-height: 1.6;">
                                                            Send and receive money any time, with no delays.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 18px 0; border-top: 1px solid #e8e5dc; border-bottom: 1px solid #e8e5dc;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="28" style="vertical-align: top; color: #c9a24b; font-size: 15px; font-weight: 700;">03</td>
                                                    <td>
                                                        <strong style="color: #14181a; font-size: 14.5px;">Smart insights</strong>
                                                        <p style="color: #75808a; font-size: 13.5px; margin: 4px 0 0; line-height: 1.6;">
                                                            Track spending patterns and grow your savings with ease.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA -->
                                <table cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                                    <tr>
                                        <td style="background-color: #0b2b2a;">
                                            <a href="http://localhost:5173/dashboard"
                                               style="display: inline-block; padding: 14px 34px; color: #ffffff; text-decoration: none; font-size: 13.5px; letter-spacing: 1px; text-transform: uppercase; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                                                Open Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 28px 44px 40px; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                                <p style="color: #9aa1a8; font-size: 12px; margin: 0; line-height: 1.6;">
                                    &copy; 2026 Underseas Bank &middot; Digital Banking Platform<br>
                                    This is an automated message. Please do not reply.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_email_async(to_email, subject, html)


def send_otp_email(to_email: str, otp_code: str):
    """Send OTP code via email for verification."""

    subject = "Your Underseas Bank Verification Code"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f4f2ec;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f2ec; padding: 48px 20px;">
            <tr>
                <td align="center">
                    <table width="460" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e3ded0;">

                        <!-- Header -->
                        <tr>
                            <td style="background-color: #0b2b2a; padding: 32px 40px; text-align: left;">
                                <p style="color: #c9a24b; margin: 0 0 4px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">
                                    Underseas Bank
                                </p>
                                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 400;">
                                    Verify your identity
                                </h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="height: 4px; background-color: #c9a24b; line-height: 4px; font-size: 0;">&nbsp;</td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px; text-align: center; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                                <p style="color: #4a5259; font-size: 14.5px; margin: 0 0 28px; line-height: 1.6;">
                                    Enter the code below to confirm it's really you:
                                </p>
                                <div style="border: 1px solid #e3ded0; padding: 22px; display: inline-block; min-width: 200px;">
                                    <span style="font-size: 34px; font-weight: 700; color: #0b2b2a; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                                        {otp_code}
                                    </span>
                                </div>
                                <p style="color: #9aa1a8; font-size: 12.5px; margin: 22px 0 0;">
                                    This code expires in <strong style="color: #14181a;">5 minutes</strong>.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 0 40px 32px; text-align: center; font-family: -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
                                <p style="color: #9aa1a8; font-size: 11.5px; margin: 0; line-height: 1.6;">
                                    If you didn't request this, please ignore this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_email_async(to_email, subject, html)
