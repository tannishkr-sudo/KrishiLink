import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


def test_api_root():
    response = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert response.status_code == 200
    assert response.json()["message"] == "Hello World"


def test_status_create_and_list():
    response = requests.post(
        f"{BASE_URL}/api/status",
        json={"client_name": "TEST_iteration_2"},
        timeout=15,
    )
    assert response.status_code == 200
    created = response.json()
    assert created["client_name"] == "TEST_iteration_2"
    assert isinstance(created["id"], str)

    listed = requests.get(f"{BASE_URL}/api/status", timeout=15)
    assert listed.status_code == 200
    assert any(item["id"] == created["id"] for item in listed.json())