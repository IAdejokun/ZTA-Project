# Create the endpoints to handle legacy IoT device data

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_device_log
import hashlib
import time


DEVICE_SECRETS = {
    "thermo-001": "d8a5fd2c",
    "cam-001": "4b1e9f0a",
    "lock-001": "7c3f6e91",
}

def generate_expected_token(device_id: str, shared_secret: str):
    current_time = int(time.time())
    timestamp = current_time // 300  # 5-minute window
    token_data = f"{device_id}{shared_secret}{timestamp}"
    token = hashlib.sha256(token_data.encode()).hexdigest()[:16]
    print(f"Backend: Device ID = {device_id}, Shared Secret = {shared_secret}")
    print(f"Backend: Current Time = {current_time}, Timestamp = {timestamp}")
    print(f"Backend: Token Data = {token_data}, Expected Token = {token}")
    return token

router = APIRouter()

#to handle legacy IoT device data


#to handle insecure IoT device data
#Accepts unauthenticated requests.

@router.post("/legacy/insecure")
async def handle_insecure_request(data: dict, db: Session = Depends(get_db)):
    """Handle unauthenticated data and and log real response time."""
    
    # Use time.time() at the beginning and end of the function 
    # to measure how long it takes to process the request.
    # time is measured in seconds.
    
    start_time = time.time() # record the start time
    
    # Process and log the request
    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "insecure",
        "status_code": 200,
        "payload_size": len(str(data)),
    }
    
    
    end_time = time.time()  # record the end time
    log_data["response_time"] = end_time - start_time  # calculate response time
    
    #create the log with response time in the database
    create_device_log(db, log_data)
    
    return {"message": "Data received insecurely", "data": data}


#to handle secure IoT device data
#Accepts authenticated requests.

@router.post("/legacy/secure")
async def handle_secure_request(data: dict, x_access_token: str = Header(None), db: Session = Depends(get_db)):
    # print("Received Payload:", data)
    # print("Received Token:", token)

    """Handle authenticated data."""
    
    # Use time.time() at the beginning and end of the function 
    # to measure how long it takes to process the request.
    # time is measured in seconds.
    
    start_time = time.time()  # record the start time
    
    device_id = data.get("device_id")
    shared_secret = DEVICE_SECRETS.get(device_id)
    if not shared_secret:
        raise HTTPException(status_code=403, detail="Unknown device")
    expected_token = generate_expected_token(device_id, shared_secret)
    if x_access_token != expected_token:
        raise HTTPException(status_code=403, detail="Invalid token")

    # Process and log the request
    log_data = {
        "device_id": data.get("device_id"),
        "device_type": data.get("device_type"),
        "mode": "secure",
        "status_code": 200,
        "payload_size": len(str(data)),
    }
    
    end_time = time.time()  # record the end time
    log_data["response_time"] = end_time - start_time
    
    # create the log with response time in the database
    create_device_log(db, log_data) # Calculate response time
    
    return {"message": "Data received securely", "data": data}


#to handle replay attack detection
#Logs replay attacks.
@router.post("/legacy/replay")
async def handle_replay_attack(data: dict, x_access_token: str = Header(None), db: Session = Depends(get_db)):
    """Simulate detection of a replay attack."""

    start_time = time.time()  # record the start time

    device_id = data.get("device_id")
    shared_secret = DEVICE_SECRETS.get(device_id)
    if not shared_secret:
        raise HTTPException(status_code=403, detail="Unknown device")
    expected_token = generate_expected_token(device_id, shared_secret)
    # If the token is not the expected one, it's a replay or invalid
    if x_access_token != expected_token:
        raise HTTPException(status_code=409, detail="Replay attack detected")

    # Process and log the request
    log_data = {
        "device_id": device_id,
        "device_type": data.get("device_type"),
        "mode": "replay",
        "status_code": 200,
        "payload_size": len(str(data)),
    }

    end_time = time.time()  # record the end time
    log_data["response_time"] = end_time - start_time

    create_device_log(db, log_data)

    return {"message": "Replay attack logged", "data": data}
