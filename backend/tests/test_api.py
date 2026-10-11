import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["privacy_mode"] == "zero_credential_retention"
    assert "X-Content-Type-Options" in response.headers
    assert response.headers["X-Content-Type-Options"] == "nosniff"


def test_breach_check_status():
    response = client.get("/api/breach-check/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["prefix_length"] == 5


@patch("app.api.routes.query_hibp_range", new_callable=AsyncMock)
def test_breach_check_valid_prefix(mock_query):
    mock_query.return_value = {
        "prefix": "5BAA6",
        "data": "1E4C9B93F3F0682250B6CF8331B7EE68FD8:3784112\r\n",
        "suffixes_returned": 1,
        "source": "hibp_k_anonymity_test",
    }

    response = client.post("/api/breach-check", json={"prefix": "5BAA6"})
    assert response.status_code == 200
    data = response.json()
    assert data["prefix"] == "5BAA6"
    assert data["suffixes_returned"] == 1


def test_breach_check_rejects_full_hash():
    # Attempting to send a 40-character full hash must fail with 422
    full_hash = "5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8"
    response = client.post("/api/breach-check", json={"prefix": full_hash})
    assert response.status_code == 422


def test_breach_check_rejects_plaintext_password():
    # Attempting to send a plaintext password must fail with 422
    response = client.post("/api/breach-check", json={"prefix": "password"})
    assert response.status_code == 422


def test_breach_check_rejects_non_hex_prefix():
    # Attempting to send invalid characters (non-hex) must fail with 422
    response = client.post("/api/breach-check", json={"prefix": "GGGGG"})
    assert response.status_code == 422


def test_get_educational_resources():
    response = client.get("/api/education/resources")
    assert response.status_code == 200
    data = response.json()
    assert "resources" in data
    assert len(data["resources"]) >= 3


def test_get_audit_demo_data():
    response = client.get("/api/audit/demo-data")
    assert response.status_code == 200
    data = response.json()
    assert "accounts" in data
    assert len(data["accounts"]) >= 3
