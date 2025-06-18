# Create the endpoints to handle legacy IoT device data

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_device_log

router = APIRouter()

#to handle legacy IoT device data


#to handle insecure IoT device data
#Accepts unauthenticated requests.

@router.post("/legacy/insecure")
async def handle_insecure_request(data: dict, db: Session = Depends(get_db)):
    """Handle unauthenticated data."""
    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "insecure",
        "status_code": 200,
        "response_time": 0.1,  # Mocked value
        "payload_size": len(str(data)),
    }
    create_device_log(db, log_data)
    return {"message": "Data received insecurely", "data": data}


#to handle secure IoT device data
#Accepts authenticated requests.

@router.post("/legacy/secure")
async def handle_secure_request(data: dict, token: str, db: Session = Depends(get_db)):
    """Handle authenticated data."""
    # Mock token validation
    if token != "valid_token":
        raise HTTPException(status_code=403, detail="Invalid token")

    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "secure",
        "status_code": 200,
        "response_time": 0.15,  # Mocked value
        "payload_size": len(str(data)),
    }
    create_device_log(db, log_data)
    return {"message": "Data received securely", "data": data}


#to handle replay attack detection
#Logs replay attacks.
@router.post("/legacy/replay")
async def handle_replay_attack(data: dict, token: str, db: Session = Depends(get_db)):
    """Simulate detection of a replay attack."""
    # Mock replay detection
    if token == "reused_token":
        raise HTTPException(status_code=409, detail="Replay attack detected")

    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "replay",
        "status_code": 200,
        "response_time": 0.2,  # Mocked value
        "payload_size": len(str(data)),
    }
    create_device_log(db, log_data)
    return {"message": "Replay attack logged", "data": data}
