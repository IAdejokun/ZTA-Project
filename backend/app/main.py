from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.device_management import router as device_management_router
from app.routes.legacy import router as legacy_router
from app.routes.metrics import router as metrics_router
from app.database import Base, engine


# Create tables in the database.
# Base.metadata.create_all ensures that all tables defined in the ORM models
# are created in the database if they do not already exist. It binds the metadata
# to the database engine and executes the necessary SQL commands to create the tables.

Base.metadata.create_all(bind=engine)

app = FastAPI(title = "Legacy IOT ZTA Gateway")

# Configure CORS

origins = [
    "http://localhost:5173",  # React app
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from the React app
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

#register routers

app.include_router(legacy_router, prefix="/api", tags=["legacy"])
app.include_router(device_management_router, prefix="/api", tags=["device_management"])
app.include_router(metrics_router, prefix="/api", tags=["dashboard_metrics"])