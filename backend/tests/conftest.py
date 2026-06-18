import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from main import app
from core.database import Base, get_db
from tests.factories.users import UserFactory
from auth.dependencies import get_current_user

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Runs once per test suite session execution.
    Ensures a clean slate by purging residual tables and rebuilding schemas cleanly.
    """
    Base.metadata.drop_all(bind=engine)
    # Rebuild all core models
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session():
    """
    Provides an isolated transaction for an individual test logic block.
    Rolls back everything at execution completion to keep tests fully decoupled.
    """
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True)
def set_factory_sessions(db_session):
    """
    Intercepts individual test steps automatically and links the active, 
    atomic db_session transaction directly into your data synthesizers.
    """
    UserFactory._meta.sqlalchemy_session = db_session
    #TODO: Register PostFactory,TagFactory later
    # PostFactory._meta.sqlalchemy_session = db_session
    
    yield

@pytest.fixture
def client(db_session):
    """
    Configures and provisions a TestClient runtime context while overriding the 
    live FastAPI 'get_db' dependency injection to use our isolated test database.
    """
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    # Swap application dependency mappings dynamically
    app.dependency_overrides[get_db] = _get_test_db
    
    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture
def logged_in_user(db_session):
    """
    Generates a saved user record who acts as the logged-in user session.
    """
    user = UserFactory.create()
    return user

@pytest.fixture
def auth_client(client, logged_in_user):
    """
    Provides a TestClient instance with an Authorization header set for the logged-in user.
    This simulates authenticated requests in tests that require user context.
    """
    def mock_get_current_user():
        return logged_in_user
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield client
    app.dependency_overrides.pop(get_current_user, None)