from flask import Blueprint
from flask_socketio import SocketIO

socket_routes = Blueprint("socket", __name__)
socketio = SocketIO()
