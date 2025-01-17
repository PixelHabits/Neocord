"""Module for the message routes."""

from flask import Blueprint, request
from flask_login import current_user

from app.models import Message, Reaction, db

message_routes = Blueprint('messages', __name__)


@message_routes.route('/<int:id>')
def get_message(id):
	"""Get a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	# Check if user is member of server that contains the channel
	server = message.channel.server
	if not any(member.id == current_user.id for member in server.members):
		return {
			'errors': {
				'message': 'You must be a member of the server to view this message'
			}
		}, 403

	return message.to_dict()


@message_routes.route('/<int:id>', methods=['PUT'])
def update_message(id):
	"""Update a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	# User must be the author of the message to update it
	if message.user_id != current_user.id:
		return {'errors': {'message': 'You are not the author of this message'}}, 403

	data = request.get_json()
	message.body = data['body']
	db.session.commit()
	return message.to_dict()


@message_routes.route('/<int:id>', methods=['DELETE'])
def delete_message(id):
	"""Delete a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	# User must be the author of the message to delete it
	if message.user_id != current_user.id:
		return {'errors': {'message': 'You are not the author of this message'}}, 403

	db.session.delete(message)
	db.session.commit()
	return {'message': 'Message deleted successfully'}, 200


@message_routes.route('/<int:message_id>/reactions')
def get_message_reactions(message_id):
	"""Get all reactions for a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(message_id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	return [reaction.to_dict() for reaction in message.reactions]


@message_routes.route('/<int:message_id>/reactions', methods=['POST'])
def add_reaction_to_message(message_id):
	"""Add a reaction to a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(message_id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	# Get emoji from request body
	data = request.get_json()
	if not data or 'emoji' not in data:
		return {'errors': {'message': 'Emoji is required'}}, 400

	# Check if user already reacted with this emoji
	existing_reaction = Reaction.query.filter(
		Reaction.message_id == message_id,
		Reaction.user_id == current_user.id,
		Reaction.emoji == data['emoji'],
	).first()

	if existing_reaction:
		return {'errors': {'message': 'You already reacted with this emoji'}}, 400

	reaction = Reaction(
		user_id=current_user.id, message_id=message_id, emoji=data['emoji']
	)

	db.session.add(reaction)
	db.session.commit()

	return reaction.to_dict()


@message_routes.route(
	'/<int:message_id>/reactions/<int:reaction_id>', methods=['DELETE']
)
def remove_reaction_from_message(message_id, reaction_id):
	"""Remove a reaction from a message by it's ID."""
	if not current_user.is_authenticated:
		return {'errors': {'message': 'Unauthorized'}}, 401

	message = Message.query.get(message_id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	# Check if user already reacted with this emoji
	existing_reaction = Reaction.query.get(reaction_id)

	if not existing_reaction:
		return {'errors': {'message': 'Reaction not found'}}, 404

	if existing_reaction.user_id != current_user.id:
		return {'errors': {'message': "You cannot remove another user's reaction"}}, 400

	db.session.delete(existing_reaction)
	db.session.commit()
	return {'message': 'Reaction removed successfully'}
