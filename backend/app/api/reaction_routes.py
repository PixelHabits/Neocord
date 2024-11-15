from app.models import Reaction
from flask import Blueprint

reaction_routes = Blueprint('reactions', __name__)


@reaction_routes.route('/<int:id>')
def get_reaction(id):
	"""
	Get a reaction by it's ID
	"""
	reaction = Reaction.query.get(id)
	if not reaction:
		return {'errors': {'message': 'Reaction not found'}}, 404
	return reaction.to_dict()
