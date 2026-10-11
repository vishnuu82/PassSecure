import httpx
from typing import Dict, Any


async def query_hibp_range(prefix: str) -> Dict[str, Any]:
    """
    Proxies a privacy-preserving k-anonymity query to Have I Been Pwned.
    Only the 5-hex prefix is forwarded.
    """
    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    headers = {
        "User-Agent": "PassSecure-Academic-Auditor/2.0",
        "Add-Padding": "true",
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                lines = [line for line in resp.text.split("\r\n") if line.strip()]
                return {
                    "prefix": prefix,
                    "data": resp.text,
                    "suffixes_returned": len(lines),
                    "source": "hibp_k_anonymity_live",
                }
            elif resp.status_code == 429:
                return {
                    "prefix": prefix,
                    "data": "",
                    "suffixes_returned": 0,
                    "source": "hibp_rate_limited",
                }
            else:
                return {
                    "prefix": prefix,
                    "data": "",
                    "suffixes_returned": 0,
                    "source": f"hibp_http_{resp.status_code}",
                }
    except Exception as e:
        # Graceful fallback if offline or disconnected
        return {
            "prefix": prefix,
            "data": "",
            "suffixes_returned": 0,
            "source": f"offline_network_error: {str(e)}",
        }
