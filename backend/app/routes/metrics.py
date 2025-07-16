from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DeviceLog
from sqlalchemy import func


router = APIRouter()

@router.get("/metrics/summary")
def get_metrics_summary(db: Session = Depends(get_db)):
    # Count total requests per mode
    mode_counts = db.query(DeviceLog.mode, func.count().label("count")).group_by(DeviceLog.mode).all()
    mode_count_map = {mode: count for mode, count in mode_counts}

    # Average latency per mode
    avg_latencies = db.query(DeviceLog.mode, func.avg(DeviceLog.response_time).label("avg_latency")).group_by(DeviceLog.mode).all()
    latency_map = {mode: round(avg, 4) for mode, avg in avg_latencies}

    # Total logs
    total_logs = db.query(func.count()).scalar()

    # Attack detection (replay mode = 409 count)
    replay_attempts = db.query(DeviceLog).filter(DeviceLog.mode == "replay").count()
    
    # ✅ Throughput calculation
    first_log = db.query(func.min(DeviceLog.created_at)).scalar()
    last_log = db.query(func.max(DeviceLog.created_at)).scalar()
    duration_secs = (last_log - first_log).total_seconds() if first_log and last_log else 1
    throughput_rps = round(total_logs / duration_secs, 2) if duration_secs > 0 else 0
    

    return {
        "latencies": latency_map,
        "requests": mode_count_map,
        "attack_detection_rate": f"{round((replay_attempts / total_logs * 100), 2) if total_logs > 0 else 0}%",
        "total_logs": total_logs,
        "throughput_rps": throughput_rps
    }
