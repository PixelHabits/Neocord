"""Module for the server routes."""

from flask import Blueprint, request
from flask_login import current_user

from app.forms.channel_form import ChannelForm
from app.forms.server_form import ServerForm
from app.models import Channel, Server, ServerMember, db

server_routes = Blueprint('server', __name__)


@server_routes.route('/')
def index():
	"""Get all servers for the current user."""
	if current_user.is_authenticated:
		print(current_user.id, ServerMember.user_id)
		servers = (
			Server.query.join(ServerMember)
			.filter(ServerMember.user_id == current_user.id)
			.all()
		)
		return [server.to_dict_basic() for server in servers], 200
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/', methods=['POST'])
def create_new_server():
	"""Create a new server."""
	if current_user.is_authenticated:
		form = ServerForm()
		form['csrf_token'].data = request.cookies['csrf_token']
		if form.validate_on_submit():
			server = Server(
				name=form.data['name'],
				description=form.data['description'],
				server_members=[
					ServerMember(
						user=current_user,
						is_owner=True,
					)
				],
			)
			db.session.add(server)
			db.session.commit()
			return server.to_dict(), 201
		return {
			'errors': {
				'message': 'Validation error',
				**{k: v[0] for k, v in form.errors.items()},
			}
		}, 400
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/<int:id>')
def show(id):
	"""Get a server by it's ID."""
	server = Server.query.get(id)
	if server:
		return server.to_dict(), 200
	return {'errors': {'message': 'Server not found'}}, 404


@server_routes.route('<int:id>', methods=['PUT'])
def update_server(id):
	"""Update a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)

		if server:
			for member in server.server_members:
				if member.user_id == current_user.id:
					if member.is_owner:
						form = ServerForm()
						form['csrf_token'].data = request.cookies['csrf_token']
						if form.validate_on_submit():
							if form.data['name'] is not None:
								server.name = form.data['name']
							if form.data['description'] is not None:
								server.description = form.data['description']
							db.session.commit()
							return server.to_dict(), 200
						return {'errors': {'message': 'Invalid form data'}}, 400
					return {
						'errors': {'message': 'User must be the owner of the server'}
					}, 401
			return {'errors': {'message': 'Server member not found'}}, 404
		return {'errors': {'message': 'Server not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('<int:id>', methods=['DELETE'])
def delete_server(id):
	"""Delete a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)

		if server:
			for member in server.server_members:
				if member.user_id == current_user.id:
					if member.is_owner:
						db.session.delete(server)
						db.session.commit()
						return {'message': 'Server deleted'}, 200
					return {
						'errors': {'message': 'User must be the owner of the server'}
					}, 401
			return {'errors': {'message': 'Server member not found'}}, 404
		return {'errors': {'message': 'Server not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/<int:id>/members', methods=['POST'])
def join_server(id):
	"""Join a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)
		if server:
			server_member = ServerMember(
				user=current_user,
				server=server,
			)
			db.session.add(server_member)
			db.session.commit()
			return server_member.to_dict(), 201
		return {'errors': {'message': 'Server not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/<int:id>/members', methods=['DELETE'])
def leave_server(id):
	"""Leave a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)

		if server:
			for member in server.server_members:
				if member.user_id == current_user.id:
					db.session.delete(member)
					db.session.commit()
					return {'message': 'Left server successfully'}, 200
			else:
				return {
					'errors': {'message': 'User is not a member of the server'}
				}, 401
		else:
			return {'errors': {'message': 'Server not found'}}, 404
	else:
		return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/<int:id>/channels')
def get_server_channels(id):
	"""Get all channels for a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)

		if server:
			for member in server.server_members:
				if member.user_id == current_user.id:
					channels = Channel.query.filter(Channel.server_id == id).all()
					return [channel.to_dict() for channel in channels], 200
			else:
				return {
					'errors': {'message': 'User is not a member of the server'}
				}, 401
		return {'errors': {'message': 'Server not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401


@server_routes.route('/<int:id>/channels', methods=['POST'])
def create_server_channel(id):
	"""Create a new channel for a server by it's ID."""
	if current_user.is_authenticated:
		server = Server.query.get(id)
		if server:
			for member in server.server_members:
				if member.user_id == current_user.id:
					if member.is_owner:
						form = ChannelForm()
						form['csrf_token'].data = request.cookies['csrf_token']
						if form.validate_on_submit():
							channel = Channel(
								name=form.data['name'],
								visibility=form.data['visibility'],
								server_id=server.id,
							)
							db.session.add(channel)
							db.session.commit()
							return channel.to_dict(), 201
					else:
						return {
							'errors': {
								'message': 'User must be the owner of the server'
							}
						}, 401
			return {'errors': {'message': 'Server member not found'}}, 404
		return {'errors': {'message': 'Server not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401
