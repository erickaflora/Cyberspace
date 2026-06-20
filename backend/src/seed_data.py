from core.database import Base, engine
from factories import UserFactory, PostFactory, TagFactory, db_session
import random

def seed_db():
    print("Connecting to database...")
    db = db_session
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)

        print("Generating tags...")
        cyber_tags = ["netrunning", "edgerunners", "cyberware", "nightcity", "blackwall", "corp", "solo", "ripperdoc"]
        tags = []
        for t in cyber_tags:
            tag = TagFactory(name=t)
            tags.append(tag)
            
        print("Generating fixed test users...")
        test_users = [
            UserFactory(username="runner_v", profile_name="V", email="v@afterlife.net"),
            UserFactory(username="silverhand", profile_name="Johnny", email="johnny@samurai.net"),
            UserFactory(username="songbird", profile_name="So Mi", email="somi@militech.com"),
        ]

        print("Generating random users...")
        random_users = UserFactory.create_batch(7)
        
        all_users = test_users + random_users

        print("Generating posts and likes...")
        for user in all_users:
            # Each user gets 3-7 posts
            num_posts = random.randint(3, 7)
            for _ in range(num_posts):
                post_tags = random.sample(tags, random.randint(1, 3))
                PostFactory(owner=user, tags=post_tags)

        # Generate likes
        from domains.posts.models import Post
        from factories import LikeFactory
        
        all_posts = db.query(Post).all()
        for post in all_posts:
            # Give each post 0-5 random likes
            num_likes = random.randint(0, 5)
            likers = random.sample(all_users, num_likes)
            for liker in likers:
                LikeFactory(user=liker, post=post, user_id=liker.id, post_id=post.id)

        print("Successfully seeded the database with posts and likes using factory_boy!")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()
        print("Database connection closed.")

if __name__ == "__main__":
    seed_db()
