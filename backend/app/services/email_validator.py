import logging
from typing import Tuple
from email_validator import validate_email, EmailNotValidError
import dns.resolver

logger = logging.getLogger("techsahaya.email_validator")

# Comprehensive denylist of known disposable, temporary, and throwaway email providers
DISPOSABLE_DOMAINS = {
    "mailinator.com",
    "10minutemail.com",
    "10minutemail.net",
    "guerrillamail.com",
    "guerrillamail.net",
    "guerrillamail.org",
    "guerrillamailblock.com",
    "sharklasers.com",
    "tempmail.com",
    "temp-mail.org",
    "temp-mail.io",
    "throwawaymail.com",
    "yopmail.com",
    "yopmail.fr",
    "yopmail.net",
    "trashmail.com",
    "trashmail.net",
    "trashmail.me",
    "dispostable.com",
    "getairmail.com",
    "mohmal.com",
    "burnermail.io",
    "fakeinbox.com",
    "crazymailing.com",
    "nada.ltd",
    "getnada.com",
    "inboxkitten.com",
    "mytemp.email",
    "tempail.com",
    "fakemailgenerator.com",
    "maildrop.cc",
    "harakirimail.com",
    "generator.email",
}

# Platform, seed, and development allowed domains
INTERNAL_ALLOWED_DOMAINS = {
    "techsahaya.org",
    "techsahaya.in",
    "example.com",
    "example.org",
    "test.com",
    "localhost",
}


class EmailValidationError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


def validate_email_address(email_input: str) -> str:
    """
    Performs multi-step gatekeeper validation on an email address:
    1. Syntax & RFC Compliance: Validates format and normalizes using email-validator.
    2. Disposable Domain Filter: Blocks temporary/burner email providers.
    3. DNS MX Deliverability Lookup: Confirms the recipient domain has active MX records.

    NOTE: MX validation confirms the recipient domain is configured to receive email;
    it does not guarantee that the specific individual mailbox exists without sending an email.

    Returns:
        Normalized email address string if valid.

    Raises:
        EmailValidationError: With specific error code and user-facing explanation.
    """
    if not email_input or not isinstance(email_input, str):
        raise EmailValidationError(
            "INVALID_FORMAT",
            "Email address cannot be empty. Please provide a valid email."
        )

    raw_email = email_input.strip().lower()

    # 1. Syntax & RFC parsing
    try:
        validated = validate_email(raw_email, check_deliverability=False)
        normalized_email = validated.normalized
        domain = validated.domain.lower()
    except EmailNotValidError as e:
        raise EmailValidationError(
            "INVALID_FORMAT",
            f"Invalid email syntax: {str(e)}"
        )

    # 2. Disposable / Burner domain check
    if domain in DISPOSABLE_DOMAINS or any(domain.endswith(f".{d}") for d in DISPOSABLE_DOMAINS):
        raise EmailValidationError(
            "DISPOSABLE_DOMAIN",
            f"The email domain '@{domain}' is a disposable or temporary email service. Please use a permanent email address."
        )

    # Bypass external DNS MX queries for internal demo and seed domains
    if domain in INTERNAL_ALLOWED_DOMAINS or domain.endswith(".internal") or domain == "localhost":
        return normalized_email

    # 3. Real DNS MX Record Lookup
    # Query MX records with a strict timeout to avoid blocking requests
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 4.0
        resolver.lifetime = 4.0
        mx_records = resolver.resolve(domain, "MX")
        if not mx_records or len(mx_records) == 0:
            raise EmailValidationError(
                "DOMAIN_NO_MX",
                f"The domain '@{domain}' exists but has no active mail servers (MX records) configured to receive email."
            )
    except (dns.resolver.NXDOMAIN, dns.resolver.NoNameservers):
        raise EmailValidationError(
            "DOMAIN_NOT_FOUND",
            f"The domain '@{domain}' does not exist or has no active DNS registration."
        )
    except dns.resolver.NoAnswer:
        # Some legacy servers accept email on A/AAAA record fallback, check for A record
        try:
            resolver = dns.resolver.Resolver()
            resolver.timeout = 3.0
            resolver.lifetime = 3.0
            a_records = resolver.resolve(domain, "A")
            if not a_records or len(a_records) == 0:
                raise EmailValidationError(
                    "DOMAIN_NO_MX",
                    f"The domain '@{domain}' has no valid mail servers (MX records) configured to receive mail."
                )
        except Exception:
            raise EmailValidationError(
                "DOMAIN_NO_MX",
                f"The domain '@{domain}' has no valid mail servers (MX records) configured to receive mail."
            )
    except dns.exception.Timeout:
        logger.warning(f"DNS lookup timed out for domain '{domain}'. Allowing through fallback.")
    except Exception as e:
        logger.warning(f"Unexpected DNS error while checking domain '{domain}': {e}")
        # If DNS fails with general network error, do not fail silently if it's clearly non-existent
        if "NXDOMAIN" in str(e) or "does not exist" in str(e).lower():
            raise EmailValidationError(
                "DOMAIN_NOT_FOUND",
                f"The domain '@{domain}' does not exist."
            )

    return normalized_email
