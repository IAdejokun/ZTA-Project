# Define functions to log data into the database
#Functions for creating and retrieving logs.
from sqlalchemy.orm import Session
from app.models import DeviceLog

def create_device_log(db: Session, log_data: dict):
    log_entry = DeviceLog(**log_data)
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry

def get_all_logs(db: Session):
    return db.query(DeviceLog).all()
