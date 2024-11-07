from flask import Blueprint, request

reaction_routes = Blueprint('reactions', __name__)

@reaction_routes.route('/<int:id>')
def get_reaction(id):
    """
    Get a reaction by it's ID
    """
    return f'Reaction {id}'
