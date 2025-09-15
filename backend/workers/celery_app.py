"""
Celery application configuration for background tasks.
Implements the task queue system as specified in the PRD.
"""

from celery import Celery
from ..core.config import settings

# Create Celery application
celery_app = Celery(
    "asf_workers",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["backend.workers.tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Optional: Configure result backend settings
celery_app.conf.result_expires = 3600  # 1 hour

if __name__ == "__main__":
    celery_app.start()
