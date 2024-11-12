from app.forms.channel_form import ChannelForm
from app.models import Channel, Message, ServerMember, db
from flask import Blueprint, request
from flask_login import current_user

channel_routes = Blueprint("channels", __name__)


@channel_routes.route("/<int:id>")
def get_channel(id):
    """
    Get a channel by it's ID
    """
    if current_user.is_authenticated:
        channel = Channel.query.get(id)
        if channel:
            server_member = ServerMember.query.filter(
                ServerMember.server_id == channel.server_id,
                ServerMember.user_id == current_user.id,
            ).first()
            if server_member:
                return channel.to_dict(), 200
            else:
                return {
                    "errors": {"message": "You are not a member of this server"}
                }, 401
        else:
            return {"errors": {"message": "Channel not found"}}, 404
    else:
        return {"errors": {"message": "Unauthorized"}}, 401


@channel_routes.route("/<int:id>", methods=["PUT"])
def update_channel(id):
    """
    Update a channel by it's ID
    """
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if current_user.is_authenticated:
        if form.validate_on_submit():
            channel = Channel.query.get(id)
            if channel:
                server_member = ServerMember.query.filter(
                    ServerMember.server_id == channel.server_id,
                    ServerMember.user_id == current_user.id,
                ).first()
                if server_member.is_owner:
                    if form.data["name"] is not None:
                        channel.name = form.data["name"]
                    if form.data["visibility"] is not None:
                        channel.visibility = form.data["visibility"]
                    db.session.commit()
                    return channel.to_dict(), 200
                else:
                    return {
                        "errors": {
                            "message": "You must be the owner of the server to update this channel"
                        }
                    }, 401
            else:
                return {"errors": {"message": "Channel not found"}}, 404
        else:
            return {"errors": form.errors}, 400
    else:
        return {"errors": {"message": "Unauthorized"}}, 401


@channel_routes.route("/<int:id>", methods=["DELETE"])
def delete_channel(id):
    """
    Delete a channel by it's ID
    """
    if current_user.is_authenticated:
        channel = Channel.query.get(id)
        if channel:
            server_member = ServerMember.query.filter(
                ServerMember.server_id == channel.server_id,
                ServerMember.user_id == current_user.id,
            ).first()
            if server_member.is_owner:
                db.session.delete(channel)
                db.session.commit()
                return {"message": "Channel successfully deleted"}, 200
            else:
                return {
                    "errors": {
                        "message": "You must be the owner of the server to delete this channel"
                    }
                }, 401
        else:
            return {"errors": {"message": "Channel not found"}}, 404
    else:
        return {"errors": {"message": "Unauthorized"}}, 401


@channel_routes.route("/<int:id>/messages")
def get_channel_messages(id):
    """
    Get all messages for a channel by it's ID
    """
    if not current_user.is_authenticated:
        return {"errors": {"message": "Unauthorized"}}, 401

    channel = Channel.query.get(id)
    if not channel:
        return {"errors": {"message": "Channel not found"}}, 404

    server_member = ServerMember.query.filter(
        ServerMember.server_id == channel.server_id,
        ServerMember.user_id == current_user.id,
    ).first()
    if not server_member:
        return {"errors": {"message": "Unauthorized"}}, 401

    messages = Message.query.filter(Message.channel_id == id).all()
    return [message.to_dict() for message in messages], 200
