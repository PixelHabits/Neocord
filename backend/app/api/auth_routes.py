"""Module for the authentication routes."""

import os

from flask import Blueprint, make_response, request
from flask_login import current_user, login_user, logout_user
from flask_wtf.csrf import generate_csrf

from app.forms import LoginForm, SignUpForm
from app.models import User, db

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
	"""Authenticates a user."""
	if current_user.is_authenticated:
		return current_user.to_dict()
	return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
	"""Logs a user in."""
	form = LoginForm()
	# Get the csrf_token from the request cookie and put it into the
	# form manually to validate_on_submit can be used
	form['csrf_token'].data = request.cookies['csrf_token']
	if form.validate_on_submit():
		# Add the user to the session, we are logged in!
		user = User.query.filter(User.email == form.data['email']).first()
		login_user(user)
		return user.to_dict()
	return {
		'errors': {
			'message': 'Validation error',
			**{k: v[0] for k, v in form.errors.items()},
		}
	}, 401


@auth_routes.route('/logout')
def logout():
	"""Logs a user out."""
	logout_user()
	return {'message': 'User logged out'}, 200


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
	"""Creates a new user and logs them in."""
	form = SignUpForm()
	form['csrf_token'].data = request.cookies['csrf_token']
	if form.validate_on_submit():
		user = User(
			username=form.data['username'],
			email=form.data['email'],
			password=form.data['password'],
		)
		db.session.add(user)
		db.session.commit()
		login_user(user)
		return user.to_dict()
	return {
		'errors': {
			'message': 'Validation error',
			**{k: v[0] for k, v in form.errors.items()},
		}
	}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
	"""Returns unauthorized JSON when flask-login authentication fails."""
	return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/csrf')
def get_csrf():
	"""Route to get CSRF token.

	Sets token as HTTP-only cookie and returns it in response header.
	"""
	response = make_response({'message': 'CSRF token set'})
	token = generate_csrf()

	response.set_cookie(
		'csrf_token',
		token,
		secure=os.environ.get('FLASK_ENV') == 'production',
		samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
		httponly=True,
		max_age=3600,  # 1 hour expiration
	)

	response.headers['X-CSRFToken'] = token

	return response
