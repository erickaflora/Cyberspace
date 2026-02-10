from fastapi import FastAPI
from core.database import engine, Base
from domains.users import router as user_router
from domains.posts import router as post_router
from auth import router as auth_router
# Initialize Tables (Basic Setup)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cyberspace MVP")

# Include the domain routers
app.include_router(user_router)
app.include_router(post_router)
app.include_router(auth_router)

@app.get("/")
def health_check():
    return {"status": "Cyberspace Online", "message": "Successfully connected to the backend."}
