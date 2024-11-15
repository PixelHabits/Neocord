from sqlalchemy.sql import text

from app.models import SCHEMA, Channel, Message, Thread, User, db, environment


def generate_messages():
	return [
		'Hey everyone! Welcome to the channel! 👋',
		'Thanks for having us here! Excited to be part of this community 😊',
		'Could someone help me with a coding problem?',
		"Sure, what's the issue? Let's discuss it in a thread",
		'The weather is perfect today! ☀️',
		'Anyone up for some gaming later? 🎮',
		'Just finished an amazing book! 📚',
		"What's everyone working on this week? 💻",
		"Don't forget about our meeting tomorrow! 📅",
		'Check out this cool article I found',
		"Who's going to the tech conference next month?",
		'I made some awesome progress on my project today! 🚀',
		'Need some feedback on my latest design',
		'Happy Friday everyone! 🎉',
		'Remember to update your dependencies',
	]


def seed_messages():
	try:
		# Get users
		demo = User.query.filter(User.username == 'Demo').first()
		marnie = User.query.filter(User.username == 'marnie').first()
		bobbie = User.query.filter(User.username == 'bobbie').first()
		users = [demo, marnie, bobbie]

		if not all([demo, marnie, bobbie]):
			return

		channels = Channel.query.all()
		if not channels:
			return

		message_list = generate_messages()

		# Create all messages
		for channel in channels:
			for i, message_body in enumerate(message_list):
				current_user = users[i % len(users)]

				message = Message(
					body=message_body,
					channel_id=channel.id,
					user_id=current_user.id,
				)
				db.session.add(message)
				db.session.flush()

				if i % 3 == 0:
					# Create thread immediately after message
					thread = Thread(channel_id=channel.id, parent_message_id=message.id)
					db.session.add(thread)

		# Commit everything at once
		db.session.commit()

	except Exception as e:
		db.session.rollback()
		raise e


def undo_messages():
	if environment == 'production':
		db.session.execute(
			f'TRUNCATE TABLE {SCHEMA}.messages RESTART IDENTITY CASCADE;'
		)
	else:
		db.session.execute(text('DELETE FROM messages'))

	db.session.commit()
