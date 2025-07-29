from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_device_log
from app.models import Device
import hashlib
import time

router = APIRouter()

def generate_expected_token(device_id: str, shared_secret: str) -> str:
    """
    Generate a time-based token valid for a 30-second window.
    """
    current_time = int(time.time())
    timestamp = current_time // 30  # Reduced from 300 to 30 for faster expiry
    token_data = f"{device_id}{shared_secret}{timestamp}"
    token = hashlib.sha256(token_data.encode()).hexdigest()[:16]

    print(f"[DEBUG] Device: {device_id}, Expected Token: {token}")
    return token


@router.post("/legacy/insecure")
async def handle_insecure_request(data: dict, db: Session = Depends(get_db)):
    """
    Handle unauthenticated legacy device data (no token required).
    """
    start_time = time.time()

    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "insecure",
        "status_code": 200,
        "payload_size": len(str(data)),
        "response_time": time.time() - start_time
    }

    create_device_log(db, log_data)
    return {"message": "Data received insecurely", "data": data}


@router.post("/legacy/secure")
async def handle_secure_request(
    data: dict,
    x_access_token: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Handle authenticated requests with token validation.
    """
    start_time = time.time()

    device_id = data.get("device_id")
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=403, detail="Unknown device")

    expected_token = generate_expected_token(device_id, device.shared_secret)
    if x_access_token != expected_token:
        raise HTTPException(status_code=403, detail="Invalid token")

    log_data = {
        "device_id": device_id,
        "device_type": data.get("device_type"),
        "mode": "secure",
        "status_code": 200,
        "payload_size": len(str(data)),
        "response_time": time.time() - start_time
    }

    create_device_log(db, log_data)
    return {"message": "Data received securely", "data": data}


@router.post("/legacy/replay")
async def handle_replay_attack(
    data: dict,
    x_access_token: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Detect and log replay attacks (reused/expired tokens).
    """
    start_time = time.time()

    device_id = data.get("device_id")
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=403, detail="Unknown device")

    expected_token = generate_expected_token(device_id, device.shared_secret)

    if x_access_token != expected_token:
        # Replay detected — log as failed
        log_data = {
            "device_id": device_id,
            "device_type": data.get("device_type"),
            "mode": "replay",
            "status_code": 409,
            "payload_size": len(str(data)),
            "response_time": time.time() - start_time
        }
        create_device_log(db, log_data)
        raise HTTPException(status_code=409, detail="Replay attack detected")

    # Token still valid (rare case)
    log_data = {
        "device_id": device_id,
        "device_type": data.get("device_type"),
        "mode": "replay",
        "status_code": 200,
        "payload_size": len(str(data)),
        "response_time": time.time() - start_time
    }
    create_device_log(db, log_data)
    return {"message": "Replay attack logged", "data": data}
