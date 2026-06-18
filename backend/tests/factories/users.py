# backend/tests/factories/users.py
import factory
from domains.users.models import User

class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    id = factory.Faker("uuid4", cast_to=None)
    username = factory.Faker("user_name")
    email = factory.Faker("email")
    profile_name = factory.Faker("name")
    hashed_password = "encrypted_string"
    is_active = True