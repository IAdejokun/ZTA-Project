#to structure the database table (schema)

from sqlalchemy import Column, Integer, String, Float, Enum, DateTime
from app.database import Base
from datetime import datetime


class Device(Base):
    __tablename__ = "devices"

    device_id = Column(String, primary_key=True, index=True)
    device_type = Column(String, nullable=False)
    mode = Column(Enum("insecure", "secure", "replay", name="device_mode"), nullable=False)
    shared_secret = Column(String)   
    

class DeviceLog(Base):
    __tablename__ = "device_logs"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    device_type = Column(String)
    mode = Column(String)  # "insecure", "secure", or "replay"
    status_code = Column(Integer)
    response_time = Column(Float)
    payload_size = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)