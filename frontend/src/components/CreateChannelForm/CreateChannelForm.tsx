import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { useModal } from '../../context/useModal';
import { handleSubmitKeysDown } from '../../utils';

export const CreateChannelForm = () => {
	const { closeModal } = useModal();
	const { createChannel, currentServer } = useStore();
	const [channelName, setChannelName] = useState('');
	const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
	const [error, setError] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError({});
		if (!channelName.trim() || !currentServer) {
			setError({ name: 'Channel name is required' });
			return;
		}

		try {
			await createChannel(currentServer.id, { name: channelName, visibility });

			closeModal();
		} catch (error) {
			setError({ server: 'Failed to create channel' });
			console.error('Failed to create channel:', error);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='p-6 flex flex-col gap-4'
			onKeyDown={(e) => handleSubmitKeysDown(e, handleSubmit)}
		>
			<h2 className='text-2xl font-bold'>Create Channel</h2>
			<div className='flex flex-col gap-2'>
				<label htmlFor='channelName' className='text-sm font-semibold'>
					Channel Name
				</label>
				<input
					type='text'
					id='channelName'
					value={channelName}
					onChange={(e) => setChannelName(e.target.value)}
					className='rounded-md bg-gray-700 p-2 text-white'
					placeholder='new-channel'
					required
				/>
				{error.name && <p className='text-red-500 text-sm'>{error.name}</p>}
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='visibility' className='text-sm font-semibold'>
					Visibility
				</label>
				<select
					id='visibility'
					value={visibility}
					onChange={(e) =>
						setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')
					}
					className='rounded-md bg-gray-700 p-2 text-white'
				>
					<option value='PUBLIC'>Public</option>
					<option value='PRIVATE'>Private</option>
				</select>
			</div>
			<button
				type='submit'
				className='rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
			>
				Create Channel
			</button>
			{error.server && <p className='text-red-500 text-sm'>{error.server}</p>}
		</form>
	);
};
