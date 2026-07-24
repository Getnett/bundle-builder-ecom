from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_catalog_endpoint_returns_valid_catalog() -> None:
    response = client.get("/api/catalog")

    assert response.status_code == 200
    catalog = response.json()
    assert catalog["version"] == 1
    assert len(catalog["steps"]) == 4
    assert catalog["initialConfiguration"]["openStepId"] == "cameras"
    assert "sku" not in catalog["steps"][0]["products"][0]


def test_health_endpoint() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
