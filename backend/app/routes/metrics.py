from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.database import get_db
from app.models import DeviceLog

router = APIRouter()

@router.get("/metrics/summary")
def get_metrics_summary(db: Session = Depends(get_db)):
    # ---------- per-mode aggregates ----------
    per_mode = (
        db.query(
            DeviceLog.mode.label("mode"),
            func.count(DeviceLog.id).label("count"),
            func.avg(DeviceLog.response_time).filter(DeviceLog.response_time.isnot(None)).label("avg_latency"),
        )
        .group_by(DeviceLog.mode)
        .all()
    )

    mode_count_map = {}
    latency_map = {}

    total_logs = 0
    for row in per_mode:
        mode = row.mode or "unknown"
        cnt = int(row.count or 0)
        avg = float(round((row.avg_latency or 0.0), 6))
        mode_count_map[mode] = cnt
        latency_map[mode] = avg
        total_logs += cnt

    # ---------- attack detection (only 409s in replay endpoint count as detected) ----------
    replay_attempts = (
        db.query(func.count(DeviceLog.id))
        .filter(and_(DeviceLog.mode == "replay", DeviceLog.status_code == 409))
        .scalar()
        or 0
    )

    attack_detection_rate = round((replay_attempts / total_logs * 100), 2) if total_logs > 0 else 0.0

    # ---------- throughput ----------
    first_log = db.query(func.min(DeviceLog.created_at)).scalar()
    last_log = db.query(func.max(DeviceLog.created_at)).scalar()

    if first_log and last_log and first_log != last_log:
        duration_secs = (last_log - first_log).total_seconds()
    else:
        duration_secs = 1.0  # avoid div-by-zero

    throughput_rps = round(total_logs / duration_secs, 4) if duration_secs > 0 else 0.0

    return {
        "latencies": latency_map,                # { insecure: 0.0123, secure: 0.0345, replay: 0.0012 }
        "requests": mode_count_map,              # { insecure: 15, secure: 15, replay: 5 }
        "attack_detection_rate": attack_detection_rate,  # number, not string
        "replay_attempts": replay_attempts,
        "total_logs": total_logs,
        "throughput_rps": throughput_rps,
        "window_seconds": duration_secs,
    }
