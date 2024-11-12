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
    print("Message received:", data)


# Route to join a server or channel
@socketio.on("join")
def handle_join(data):
    print("User joined:", data)


# Route to leave a server or channel
@socketio.on("leave")
def handle_leave(data):
    print("User left:", data)
