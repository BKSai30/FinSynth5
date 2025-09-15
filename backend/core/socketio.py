"""
Socket.IO configuration for real-time communication.
Implements WebSocket support as specified in the PRD.
"""

import socketio
from typing import Dict, Any
from fastapi import FastAPI

from .config import settings

# Create Socket.IO server
sio = socketio.AsyncServer(
    cors_allowed_origins=settings.cors_origins,
    logger=True,
    engineio_logger=True
)


@sio.event
async def connect(sid: str, environ: Dict[str, Any], auth: Dict[str, Any] = None):
    """Handle client connection."""
    print(f"Client {sid} connected")
    await sio.emit("connected", {"message": "Connected to ASF backend"}, room=sid)


@sio.event
async def disconnect(sid: str):
    """Handle client disconnection."""
    print(f"Client {sid} disconnected")


@sio.event
async def join_forecast_room(sid: str, data: Dict[str, Any]):
    """Join a forecast room for real-time updates."""
    query_id = data.get("query_id")
    if query_id:
        room = f"forecast_{query_id}"
        await sio.enter_room(sid, room)
        await sio.emit("joined_room", {"room": room}, room=sid)
        print(f"Client {sid} joined room {room}")


@sio.event
async def leave_forecast_room(sid: str, data: Dict[str, Any]):
    """Leave a forecast room."""
    query_id = data.get("query_id")
    if query_id:
        room = f"forecast_{query_id}"
        await sio.leave_room(sid, room)
        await sio.emit("left_room", {"room": room}, room=sid)
        print(f"Client {sid} left room {room}")


async def emit_forecast_update(query_id: int, status: str, data: Dict[str, Any] = None):
    """
    Emit forecast update to all clients in the forecast room.
    
    Args:
        query_id: ID of the forecast query
        status: Current status of the forecast
        data: Additional data to send
    """
    room = f"forecast_{query_id}"
    message = {
        "query_id": query_id,
        "status": status,
        "timestamp": data.get("timestamp") if data else None,
        "data": data
    }
    
    await sio.emit("forecast_update", message, room=room)
    print(f"Emitted forecast update to room {room}: {status}")


async def emit_forecast_progress(query_id: int, progress: int, message: str):
    """
    Emit forecast progress update.
    
    Args:
        query_id: ID of the forecast query
        progress: Progress percentage (0-100)
        message: Progress message
    """
    room = f"forecast_{query_id}"
    await sio.emit("forecast_progress", {
        "query_id": query_id,
        "progress": progress,
        "message": message
    }, room=room)


def create_socketio_app(fastapi_app: FastAPI) -> socketio.ASGIApp:
    """
    Create Socket.IO ASGI app and mount it to FastAPI.
    
    Args:
        fastapi_app: FastAPI application instance
        
    Returns:
        Socket.IO ASGI application
    """
    socketio_app = socketio.ASGIApp(sio, fastapi_app)
    return socketio_app
