"""Module for the message form."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class MessageForm(FlaskForm):
	"""Message form."""

	body = StringField('body', validators=[DataRequired(), Length(max=10000)])
