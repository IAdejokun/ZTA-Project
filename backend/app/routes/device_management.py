from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Device as DeviceModel #used to import the SQLAlchemy model for devices

# Create a router for device management
router = APIRouter()

# Schema for validating device data
class Device(BaseModel):
    device_id: str
    device_type: str
    mode: str

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
    new_device = DeviceModel(**device.dict())
    db.add(new_device)
    db.commit()
    return {"message": "Device added successfully", "device": new_device}

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
