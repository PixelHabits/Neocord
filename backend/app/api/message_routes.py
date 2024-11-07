from flask import Blueprint, request

message_routes = Blueprint('messages', __name__)

@message_routes.route('/<int:id>')
def get_message(id):
    """
    Get a message by it's ID
    """
    return f'Message {id}'

@message_routes.route('/', methods=['POST'])
def create_message():
    """
    Create a new message
    """
    return 'Create a new message'

@message_routes.route('/<int:id>', methods=['PUT'])
def update_message(id):
    """
    Update a message by it's ID
    """
    return f'Update message {id}'

@message_routes.route('/<int:id>', methods=['DELETE'])
def delete_message(id):
    """
    Delete a message by it's ID
    """
    return f'Delete message {id}'


@message_routes.route('/<int:messageId>/reactions')
def get_message_reactions(messageId):
    """
    Get all reactions for a message by it's ID
    """
    return f'Message {messageId} reactions'

@message_routes.route('/<int:messageId>/reactions', methods=['POST'])
def add_reaction_to_message(messageId):
    """
    Add a reaction to a message by it's ID
    """
    return f'Add reaction to message {messageId}'

@message_routes.route('/<int:messageId>/reactions/<int:reactionId>', methods=['DELETE'])
def remove_reaction_from_message(messageId, reactionId):
    """
    Remove a reaction from a message by it's ID
    """
    return f'Remove reaction from message {messageId}'
