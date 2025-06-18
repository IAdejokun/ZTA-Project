#to structure the database table (schema)

from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class DeviceLog(Base):
    __tablename__ = "device_logs"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    device_type = Column(String)
    mode = Column(String)  # "insecure", "secure", or "replay"
    status_code = Column(Integer)
    response_time = Column(Float)
    payload_size = Column(Integer)
