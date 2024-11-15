"""Module for seeding and managing message data in the database."""

from sqlalchemy.sql import text

from app.models import SCHEMA, Channel, Message, Thread, User, db, environment


def generate_messages():
	"""Generate a list of messages."""
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


def generate_message_replies(original_message):
	"""Generate contextual replies based on the original message."""
	replies = {
		'Hey everyone! Welcome to the channel! 👋': [
			'Welcome! Glad to be here! 🎉',
			'Thanks for the warm welcome! Looking forward to chatting with everyone 😊',
		],
		'Could someone help me with a coding problem?': [
			'Of course! What seems to be the issue? 🤔',
			"Happy to help! Can you share more details about what you're working on?",
		],
		"What's everyone working on this week? 💻": [
			"I'm building a new React component library! Making good progress so far.",
			'Working on our database queries. Found some interesting bottlenecks.',
		],
		"Don't forget about our meeting tomorrow! 📅": [
			'What time was it again? Can you share the meeting link?',
			"Thanks for the reminder! I'll prepare my updates.",
		],
		"Who's going to the tech conference next month?": [
			"I'll be there! We should coordinate and meet up 🤝",
			'Which talks are you planning to attend? The AI track looks interesting!',
		],
	}
	# Return default replies if no specific replies are defined
	default_replies = [
		f'Interesting point about: {original_message}',
		f'Thanks for sharing! Regarding {original_message.lower()}',
	]
	return replies.get(original_message, default_replies)


def seed_messages():
	"""Seed the database with messages."""
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

				# Create initial message
				message = Message(
					body=message_body,
					channel_id=channel.id,
					user_id=current_user.id,
				)
				db.session.add(message)
				db.session.flush()  # Flush to get message.id

				if i % 3 == 0:  # Create thread for every third message
					thread = Thread(channel_id=channel.id, parent_message_id=message.id)
					db.session.add(thread)
					db.session.flush()  # Flush to get thread.id

					# Update the original message with thread_id
					message.thread_id = thread.id

					# Add contextual replies in the thread
					replies = generate_message_replies(message_body)
					for j, reply_text in enumerate(replies):
						reply_user = users[(i + j + 1) % len(users)]
						reply = Message(
							body=reply_text,
							channel_id=channel.id,
							user_id=reply_user.id,
							thread_id=thread.id,
						)
						db.session.add(reply)

		# Commit everything at once
		db.session.commit()

	except Exception as e:
		db.session.rollback()
		raise e


def undo_messages():
	"""Undo the seeding of messages."""
	if environment == 'production':
		db.session.execute(
			f'TRUNCATE TABLE {SCHEMA}.messages RESTART IDENTITY CASCADE;'
		)
	else:
		db.session.execute(text('DELETE FROM messages'))

	db.session.commit()
