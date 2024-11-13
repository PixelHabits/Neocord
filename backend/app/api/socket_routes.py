import os

from flask_socketio import SocketIO

socketio = SocketIO()

if os.environ.get("FLASK_ENV") == "production":
    origins = "*"  # TODO: replace with domain
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


# Route to connect to the socket
@socketio.on("connect")
def handle_connect():
    print("Client connected")


# Route to disconnect from the socket
@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


# Route to send a message to the socket
@socketio.on("message")
def handle_message(data):
    """Handle new chat messages in channels"""
    # data should contain: channel_id, content, sender_id
    socketio.emit("chat_message", data, room=f"channel_{data['channel_id']}")


# Route to send typing status in the channel
@socketio.on("typing_status")
def handle_typing(data):
    """Handle typing indicators"""
    # data should contain: channel_id, user_id, status (started/stopped)
    socketio.emit("typing_status", data, room=f"channel_{data['channel_id']}")


# Handle room/channel management
@socketio.on("join_channel")
def handle_join_channel(data):
    """Join a specific channel room"""
    # data should contain: channel_id, user_id
    channel_room = f"channel_{data['channel_id']}"
    socketio.join_room(channel_room)
    socketio.emit("user_joined_channel", data, room=channel_room)


# Route to leave a server or channel
@socketio.on("leave_channel")
def handle_leave_channel(data):
    """Leave a specific channel room"""
    # data should contain: channel_id, user_id
    channel_room = f"channel_{data['channel_id']}"
    socketio.leave_room(channel_room)
    socketio.emit("user_left_channel", data, room=channel_room)
