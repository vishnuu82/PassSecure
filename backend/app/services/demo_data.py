from typing import List, Dict, Any

SYNTHETIC_AUDIT_DATA: List[Dict[str, Any]] = [
    {
        "id": "acme-101",
        "service": "Corporate Active Directory",
        "username": "j.doe@acmecorp.internal",
        "sample_pattern": "Season + Year + Symbol (e.g., Autumn2024!)",
        "length": 11,
        "score_label": "Weak",
        "is_reused": True,
        "mfa_status": "None",
        "risk_level": "Critical",
        "remediation": "Enforce 16+ character passphrases and mandatory WebAuthn MFA.",
    },
    {
        "id": "acme-102",
        "service": "Production Kubernetes Cluster",
        "username": "k8s_admin_cluster",
        "sample_pattern": "Random 24-char cryptographic secret",
        "length": 24,
        "score_label": "Very Strong",
        "is_reused": False,
        "mfa_status": "Hardware Key (FIDO2)",
        "risk_level": "Low",
        "remediation": "Maintains optimal hygiene. Review token expiry periodically.",
    },
    {
        "id": "acme-103",
        "service": "Finance & Payroll Portal",
        "username": "payroll@acmecorp.internal",
        "sample_pattern": "Common dictionary word with substitution (P@ssw0rd)",
        "length": 8,
        "score_label": "Very Weak",
        "is_reused": False,
        "mfa_status": "None",
        "risk_level": "Critical",
        "remediation": "Immediate rotation required. Leet-speak words are cracked in milliseconds.",
    },
]

EDUCATIONAL_RESOURCES: List[Dict[str, Any]] = [
    {
        "title": "NIST SP 800-63B Digital Identity Guidelines",
        "organization": "National Institute of Standards and Technology",
        "url": "https://pages.nist.gov/800-63-3/sp800-63b.html",
        "key_takeaway": "Recommends against periodic password rotation without cause and emphasizes length over arbitrary character composition rules.",
    },
    {
        "title": "CISA Password Security Guidance",
        "organization": "Cybersecurity and Infrastructure Security Agency",
        "url": "https://www.cisa.gov/secure-our-world/use-strong-passwords",
        "key_takeaway": "Advocates for at least 16 characters or 4-word passphrases combined with multi-factor authentication.",
    },
    {
        "title": "OWASP Authentication Cheat Sheet",
        "organization": "Open Web Application Security Project",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
        "key_takeaway": "Provides architectural guidelines for credential hashing using Argon2id, bcrypt, and rate-limiting authentication endpoints.",
    },
]
