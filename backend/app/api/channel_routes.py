from flask import Blueprint, request

channel_routes = Blueprint('channels', __name__)

@channel_routes.route('/<int:id>')
def get_channel(id):
    """
    Get a channel by it's ID
    """
    return f'Channel {id}'

@channel_routes.route('/', methods=['POST'])
def create_channel():
    """
    Create a new channel
    """
    return 'Create a new channel'

@channel_routes.route('/<int:id>', methods=['PUT'])
def update_channel(id):
    """
    Update a channel by it's ID
    """
    return f'Update channel {id}'

@channel_routes.route('/<int:id>', methods=['DELETE'])
def delete_channel(id):
    """
    Delete a channel by it's ID
    """
    return f'Delete channel {id}'

@channel_routes.route('/<int:id>/messages')
def get_channel_messages(id):
    """
    Get all messages for a channel by it's ID
    """
    return f'Channel {id} messages'
