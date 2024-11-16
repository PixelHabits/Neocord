import { Message } from '../../../types';

export const MessageItem = ({ message }: { message: Message }) => {
	return (
		<div>
			<h4>{message.user?.username}</h4>
			<div className='flex rounded-sm bg-neutral-800/80 shadow-md px-4 py-8 text-neutral-400'>
				<span>{message.body}</span>
				{/* <button onClick={() => handleDeleteMessage(msg.id)}>Delete</button> */}
			</div>
			<span className='text-xs italic'>
				{new Date(message.createdAt).toLocaleString()}
			</span>
		</div>
	);
};
