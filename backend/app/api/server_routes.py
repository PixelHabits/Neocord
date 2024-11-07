from flask import Blueprint, request

server_routes = Blueprint('server', __name__)

@server_routes.route('/')
def index():
    """
    Get all servers for the current user
    """
    return 'User Servers'

@server_routes.route('/<int:id>')
def show(id):
    """
    Get a server by it's ID
    """
    return f'Server {id}'

@server_routes.route('/', methods=['POST'])
def create():
    """
    Create a new server
    """
    return 'Create a new server'

@server_routes.route('/<int:id>', methods=['PUT'])
def update(id):
    """
    Update a server by it's ID
    """
    return f'Update server {id}'

@server_routes.route('/<int:id>', methods=['DELETE'])
def delete(id):
    """
    Delete a server by it's ID
    """
    return f'Delete server {id}'

@server_routes.route('/<int:id>/channels')
def get_server_channels(id):
    """
    Get all channels for a server by it's ID
    """
    return f'Server {id} channels'
