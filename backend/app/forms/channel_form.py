from flask_wtf import FlaskForm
from wtforms import SelectField, StringField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    visibility = SelectField(
        "visibility",
        choices=[("PUBLIC", "PUBLIC"), ("PRIVATE", "PRIVATE")],
        validators=[DataRequired()],
    )
