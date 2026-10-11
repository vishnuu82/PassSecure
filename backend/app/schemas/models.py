import re
from pydantic import BaseModel, Field, field_validator


class BreachPrefixRequest(BaseModel):
    """
    Strict k-Anonymity query schema.
    Guarantees that ONLY a 5-character hexadecimal prefix is accepted.
    Plaintext passwords or full hashes are strictly rejected with HTTP 422.
    """
    prefix: str = Field(
        ...,
        description="First 5 hexadecimal characters of the SHA-1 hash",
        min_length=5,
        max_length=5,
        examples=["5BAA6"],
    )

    @field_validator("prefix")
    @classmethod
    def validate_hex_prefix(cls, v: str) -> str:
        clean = v.strip().upper()
        if not re.fullmatch(r"^[0-9A-F]{5}$", clean):
            raise ValueError(
                "Invalid k-anonymity prefix: Must be exactly 5 hexadecimal characters [0-9A-F]. "
                "Plaintext passwords or full hashes must never be transmitted."
            )
        return clean


class BreachPrefixResponse(BaseModel):
    prefix: str
    match_count: int
    suffixes_returned: int
    data: str
    source: str = "hibp_k_anonymity"
    disclaimer: str = (
        "Zero-knowledge protocol: Plaintext passwords are never accepted or processed."
    )


class HealthResponse(BaseModel):
    status: str
    version: str
    service: str
    privacy_mode: str
