import factory
from faker import Faker
from core.database import SessionLocal
from domains.users.models import User
from domains.posts.models import Post, Tag
from auth.utils import hash_password

faker = Faker()

db_session = SessionLocal()

class BaseFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        abstract = True
        sqlalchemy_session = db_session
        sqlalchemy_session_persistence = 'commit'

class UserFactory(BaseFactory):
    class Meta:
        model = User
        sqlalchemy_get_or_create = ('username',)

    username = factory.Sequence(lambda n: f"{faker.user_name()}_{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@nightcity.com")
    profile_name = factory.LazyFunction(faker.name)
    hashed_password = factory.LazyFunction(lambda: hash_password("password123"))

class TagFactory(BaseFactory):
    class Meta:
        model = Tag
        sqlalchemy_get_or_create = ('name',)

    name = factory.Sequence(lambda n: f"{faker.word()}_{n}")

class PostFactory(BaseFactory):
    class Meta:
        model = Post

    content = factory.LazyFunction(lambda: faker.text(max_nb_chars=280))
    owner = factory.SubFactory(UserFactory)

    @factory.post_generation
    def tags(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for tag in extracted:
                self.tags.append(tag)

from domains.posts.models import Like

class LikeFactory(BaseFactory):
    class Meta:
        model = Like
        sqlalchemy_get_or_create = ('user_id', 'post_id')

    user = factory.SubFactory(UserFactory)
    post = factory.SubFactory(PostFactory)
