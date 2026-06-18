from tests.factories.users import UserFactory
from fastapi import status
import uuid

def test_get_user_success(client):
    """
    Arrange: Generate a user record using Factory Boy.
    Act: Target the route using the dynamic user.id.
    Assert: Check for a 200 OK status and verified matching attributes.
    """
    user = UserFactory.create()
    response = client.get(f"/users/{user.id}")
    assert response.status_code == status.HTTP_200_OK  
    data = response.json()
    assert data["id"] == str(user.id)
    assert data["email"] == user.email
    assert data["username"] == user.username

def test_get_user_profile_by_id_not_found(client):
    """
    Arrange: Generate a random UUID that is completely absent from the DB.
    Act: GET request against the endpoint.
    Assert: Verify the route correctly triggers a 404 response.
    """
    random_id = uuid.uuid4()
    response = client.get(f"/users/{random_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "User not found."

def test_register_user_success(client):
    """
    Arrange: Create a user with valid data.
    Act: POST request to the registration endpoint.
    Assert: Verify the system creates the profile and returns a 201 Created status.
    """
    unsaved_user = UserFactory.build()
    
    payload = {
        "username": unsaved_user.username,
        "email": unsaved_user.email,
        "password": "Password123!",
        "profile_name": unsaved_user.profile_name
    }
    
    response = client.post("/users/", json=payload)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["username"] == payload["username"]
    assert data["email"] == payload["email"]
    assert "id" in data

def test_register_user_fail_to_create(client):
    """
    Arrange: Create a user with valid data.
    Act: POST request to the registration endpoint with the same data to trigger a duplicate error.
    Assert: Verify the system returns a 400 Bad Request status due to duplicate username/email.
    """
    unsaved_user = UserFactory.build()
    
    payload = {
        "username": unsaved_user.username,
        "email": unsaved_user.email,
        "password": "Password123!",
        "profile_name": unsaved_user.profile_name
    }
    
    # First registration should succeed
    response1 = client.post("/users/", json=payload)
    assert response1.status_code == status.HTTP_201_CREATED
    
    # Same data should fail
    response2 = client.post("/users/", json=payload)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert response2.json()["detail"] in ["Username already registered.", "Email already registered."]