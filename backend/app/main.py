from fastapi import FastAPI
from app.routes.legacy import router as legacy_router
from app.database import Base, engine


# Create tables in the database.
# Base.metadata.create_all ensures that all tables defined in the ORM models
# are created in the database if they do not already exist. It binds the metadata
# to the database engine and executes the necessary SQL commands to create the tables.

Base.metadata.create_all(bind=engine)

app = FastAPI(title = "Legacy IOT ZTA Gateway")

app.include_router(legacy_router, prefix="/api", tags=["legacy"])
