from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Device as DeviceModel #used to import the SQLAlchemy model for devices
import secrets

# Create a router for device management
router = APIRouter()   


# Schema for validating device data
class Device(BaseModel):
    device_id: str
    device_type: str
    mode: str

    class Config:
        orm_mode = True
            
# Fetch all devices
@router.get("/devices")
async def get_devices(db: Session = Depends(get_db)):
    """Fetch all registered devices."""
    return db.query(DeviceModel).all()

# Add a new device
@router.post("/devices")
async def add_device(device: Device, db: Session = Depends(get_db)):
    """Add a new device."""
    if db.query(DeviceModel).filter(DeviceModel.device_id == device.device_id).first():
        raise HTTPException(status_code=400, detail="Device ID already exists")
    
    shared_secret = secrets.token_hex(4)  # Generate a random shared secret
    
    new_device = DeviceModel(
        device_id=device.device_id,
        device_type=device.device_type,
        mode=device.mode,
        shared_secret=shared_secret  # Assuming shared_secret is a field in DeviceModel
    )
    
    
    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return {
        "message": "Device added successfully",
        "device": {
            "device_id": new_device.device_id,
            "device_type": new_device.device_type,
            "mode": new_device.mode,
            "shared_secret": new_device.shared_secret  # optional to return
        }
    }

# Delete a device
@router.delete("/devices/{device_id}")
async def delete_device(device_id: str, db: Session = Depends(get_db)):
    """ Delete a device from the database by its ID. """
    device = db.query(DeviceModel).filter(DeviceModel.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"message": f"Device {device_id} deleted successfully"}
