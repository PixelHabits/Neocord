"""Module for the server form."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class ServerForm(FlaskForm):
	"""Server form."""

	name = StringField('name', validators=[DataRequired()])
	description = StringField('description')
