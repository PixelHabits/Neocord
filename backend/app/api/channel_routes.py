from app.forms.channel_form import ChannelForm
from app.models import Channel, db
from flask import Blueprint, request

channel_routes = Blueprint("channels", __name__)


@channel_routes.route("/<int:id>")
def get_channel(id):
    """
    Get a channel by it's ID
    """
    channel = Channel.query.get(id)
    if channel:
        return channel.to_dict(), 200
    else:
        return {"errors": {"message": "Channel not found"}}, 404


@channel_routes.route("/<int:id>", methods=["PUT"])
def update_channel(id):
    """
    Update a channel by it's ID
    """
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        channel = Channel.query.get(id)
        if channel:
            if form.data["name"] is not None:
                channel.name = form.data["name"]
            if form.data["visibility"] is not None:
                channel.visibility = form.data["visibility"]
            db.session.commit()
            return channel.to_dict(), 200
        else:
            return {"errors": {"message": "Channel not found"}}, 404
    else:
        return {"errors": form.errors}, 400


@channel_routes.route("/<int:id>", methods=["DELETE"])
def delete_channel(id):
    """
    Delete a channel by it's ID
    """
    channel = Channel.query.get(id)
    if channel:
        db.session.delete(channel)
        db.session.commit()
        return {"message": "Channel successfully deleted"}, 200
    else:
        return {"errors": {"message": "Channel not found"}}, 404


@channel_routes.route("/<int:id>/messages")
def get_channel_messages(id):
    """
    Get all messages for a channel by it's ID
    """
    return f"Channel {id} messages"
