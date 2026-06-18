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

def test_update_own_profile_success(auth_client, logged_in_user):
    """
    Arrange: Use an authenticated client and the logged-in user's ID.
    Act: Send a PUT request to update the user's profile with new data.
    Assert: Verify the system updates the profile and returns a 200 OK status.
    """
    payload = {
        "profile_name": "Updated Profile Name",
    }
    
    response = auth_client.patch(f"/users/me", json=payload)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["profile_name"] == payload["profile_name"]
    assert data["username"] == logged_in_user.username
    assert data["id"] == str(logged_in_user.id)

def test_update_own_profile_unauthorized(client):
    """
    Arrange: Use an unauthenticated client.
    Act: Attempt to update a profile without providing credentials.
    Assert: Verify the system returns a 401 Unauthorized status.
    """
    payload = {
        "profile_name": "Should Not Update",
    }
    
    response = client.patch("/users/me", json=payload)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

def test_delete_user_success(auth_client, logged_in_user):
    """
    Arrange: Create a user to be deleted.
    Act: Send a DELETE request to the endpoint with the user's ID.
    Assert: Verify the system deletes the user and returns a 204 No Content status.
    """
    response = auth_client.delete(f"/users/{logged_in_user.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_delete_user_success(auth_client, logged_in_user):
    """
    Arrange: Create a user to be deleted.
    Act: Send a DELETE request to the endpoint with the user's ID.
    Assert: Verify the system deletes the user and returns a 204 No Content status.
    """
    response = auth_client.delete(f"/users/{logged_in_user.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_delete_user_fail_unauthenticated(client):
    """
    Arrange: Generate a random target UUID.
    Act: Attempt a DELETE request using a completely unauthenticated client.
    Assert: Verify the system blocks the request with a 401 Unauthorized status.
    """
    random_id = uuid.uuid4()
    response = client.delete(f"/users/{random_id}")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_user_fail_not_found(auth_client):
    """
    Arrange: Generate a true random UUID that is absent from the database.
    Act: Attempt a DELETE request using an authenticated auth_client.
    Assert: Verify the system handles the missing resource with a 404 Not Found status.
    """
    random_id = uuid.uuid4()
    response = auth_client.delete(f"/users/{random_id}")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "User not found."

def test_delete_user_fail_unauthorized_attacker(auth_client, logged_in_user):
    """
    Arrange: Generate a separate victim user profile in the database.
    Act: Attempt to delete the victim's profile using the auth_client (logged_in_user session).
    Assert: Verify the system returns a 403 Forbidden error and leaves the victim intact.
    """
    victim_user = UserFactory.create()
    response = auth_client.delete(f"/users/{victim_user.id}")
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == "You are not authorized to delete this user profile."