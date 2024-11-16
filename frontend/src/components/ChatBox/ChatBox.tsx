import React, { useEffect, useState } from 'react';
import './ChatBox.css';
import { BiSend } from 'react-icons/bi';
import type { Message } from '../../types/index.ts';
import { useStore } from '../../store/store.ts';
import { MessageItem } from './components/MessageItem.tsx';

export const ChatBox = () => {
	const [messageInput, setMessageInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { currentChannel } = useStore();
	const {
		getChannelMessages,
		createMessage,
		deleteMessage,
		messages: channelMessages,
	} = useStore();

	const messages = currentChannel
		? (channelMessages[currentChannel.id] ?? [])
		: [];

	useEffect(() => {
		const fetchMessages = async () => {
			setErrorMessage(null);
			setIsLoading(true);
			if (currentChannel?.id) {
				try {
					await getChannelMessages(currentChannel.id);
				} catch (error) {
					setErrorMessage('Failed to fetch messages:');
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchMessages();
	}, [currentChannel?.id]);

	const handleSubmitMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!messageInput.trim() || !currentChannel) return;

		try {
			await createMessage(currentChannel.id, { body: messageInput });
			setMessageInput('');
		} catch (error) {
			setErrorMessage('Failed to send message');
		}
	};

	const handleDeleteMessage = async (messageId: number) => {
		try {
			await deleteMessage(messageId);
		} catch (error) {
			setErrorMessage('Failed to delete message');
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className='h-[calc(100vh-200px)] overflow-y-auto p-4'>
				<div className='flex flex-col gap-4'>
					{messages.map((msg) => (
						<MessageItem message={msg} key={msg.id} />
					))}
				</div>
			</div>
			<form
				onSubmit={handleSubmitMessage}
				className='relative flex items-center justify-center p-2'
			>
				<textarea
					className='w-full resize-none rounded-md bg-neutral-800 p-2 text-neutral-100 focus:outline-none'
					placeholder='Type your message...'
					rows={3}
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
				/>
				<button
					type='submit'
					className='mx-2 cursor-pointer rounded-full bg-purple-400 p-2 text-white hover:bg-purple-500'
					disabled={!messageInput.trim()}
				>
					<BiSend size={32} />
				</button>
			</form>
		</>
	);
};
