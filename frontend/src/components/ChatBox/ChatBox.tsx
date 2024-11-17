import type React from 'react';
import { useEffect, useState } from 'react';
import './ChatBox.css';
import { BiSend } from 'react-icons/bi';

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
				} catch {
					setErrorMessage('Failed to fetch messages:');
				} finally {
					setIsLoading(false);
				}
			}
		};
		fetchMessages();
	}, [currentChannel?.id, getChannelMessages]);

	const handleSubmitMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		if (!(messageInput.trim() && currentChannel)) {
			setErrorMessage('Message cannot be empty');
			return;
		}

		try {
			await createMessage(currentChannel.id, { body: messageInput });
			setMessageInput('');
		} catch {
			setErrorMessage('Failed to send message');
		}
	};

	// Use this to delete messages
	// const handleDeleteMessage = async (messageId: number) => {
	// 	try {
	// 		await deleteMessage(messageId);
	// 	} catch (error) {
	// 		setErrorMessage('Failed to delete message');
	// 	}
	// };

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className='flex flex-col h-screen max-h-screen overflow-hidden'>
				<div className='flex-1 overflow-y-auto flex flex-col gap-4'>
					{messages.length > 0 ? (
						messages.map((msg) => <MessageItem message={msg} key={msg.id} />)
					) : (
						<div className='flex h-full flex-1 flex-col items-center justify-center text-gray-400'>
							<h3 className='mb-2 font-bold text-xl'>
								Welcome to #{currentChannel?.name}!
							</h3>
							<p>This is the beginning of this channel.</p>
							<p className='text-sm'>Be the first to send a message!</p>
						</div>
					)}
				</div>
			</div>
			<form
				onSubmit={handleSubmitMessage}
				className='relative flex-shrink-0 flex items-center justify-center p-2'
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
				{errorMessage && <p className='text-red-500'>{errorMessage}</p>}
			</form>
		</>
	);
};
