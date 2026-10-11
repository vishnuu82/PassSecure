from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.models import (
    BreachPrefixRequest,
    BreachPrefixResponse,
    HealthResponse,
)
from app.services.breach_proxy import query_hibp_range
from app.services.demo_data import SYNTHETIC_AUDIT_DATA, EDUCATIONAL_RESOURCES

router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Returns API health and privacy boundary guarantees.
    """
    return HealthResponse(
        status="operational",
        version="2.0.0",
        service="PassSecure-Security-Auditor",
        privacy_mode="zero_credential_retention",
    )


@router.get("/breach-check/status")
async def breach_check_status():
    """
    Returns the availability of the privacy-preserving breach check service.
    """
    return {
        "status": "ready",
        "protocol": "k-anonymity-sha1-range",
        "prefix_length": 5,
        "disclosure": "Accepts strictly 5-hex prefix. Never accepts plaintext passwords or full hashes.",
    }


@router.post("/breach-check", response_model=BreachPrefixResponse)
async def breach_check(payload: BreachPrefixRequest):
    """
    Strict k-Anonymity breach lookup.
    Validates that payload.prefix is exactly 5 hex characters.
    Plaintext passwords or full hashes will fail validation and are rejected.
    """
    result = await query_hibp_range(payload.prefix)

    return BreachPrefixResponse(
        prefix=payload.prefix,
        match_count=result.get("suffixes_returned", 0),
        suffixes_returned=result.get("suffixes_returned", 0),
        data=result.get("data", ""),
        source=result.get("source", "hibp_k_anonymity"),
    )


@router.get("/education/resources")
async def get_educational_resources():
    """
    Returns curated authoritative cybersecurity resources and standards.
    """
    return {"resources": EDUCATIONAL_RESOURCES}


@router.get("/audit/demo-data")
async def get_audit_demo_data():
    """
    Returns synthetic educational account examples for demonstration.
    """
    return {"accounts": SYNTHETIC_AUDIT_DATA}
