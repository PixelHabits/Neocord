from app.forms.channel_form import ChannelForm
from app.models import Channel, Message, ServerMember, Thread, db
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

    messages = Message.query.filter(
        Message.channel_id == id, Message.thread_id == None
    ).all()
    return [message.to_dict() for message in messages], 200


@channel_routes.route("/<int:id>/messages", methods=["POST"])
def create_channel_message(id, parent_message_id=None):
    """
    Create a new message for a channel by it's ID
    """
    parent_message_id = request.args.get("parent_message_id")
    thread = None

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
        return {
            "errors": {
                "message": "You must be a member of the server to create a message"
            }
        }, 401

    data = request.get_json()
    if not data or "body" not in data:
        return {"errors": {"message": "body is required"}}, 400

    if parent_message_id:
        parent_message = Message.query.get(parent_message_id)
        if not parent_message:
            return {"errors": {"message": "Parent message not found"}}, 404

        if parent_message.channel_id != id:
            return {"errors": {"message": "Parent message is not in this channel"}}, 400
        else:
            thread = Thread.query.filter(
                Thread.parent_message_id == parent_message_id
            ).first()
            if not thread:
                thread = Thread(channel_id=id, parent_message_id=parent_message_id)
                db.session.add(thread)
                db.session.commit()

    message = Message(
        body=data["body"],
        channel_id=id,
        user_id=current_user.id,
        thread_id=thread.id if thread and parent_message_id else None,
    )

    db.session.add(message)
    db.session.commit()
    return message.to_dict(), 201
