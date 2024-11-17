import type React from 'react';
import { useState } from 'react';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';
import { handleSubmitKeysDown } from '../../utils/index.ts';

const formatChannelName = (name: string) => {
	return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export const CreateChannelForm = () => {
	const { closeModal } = useModal();
	const { createChannel, currentServer } = useStore();
	const [channelName, setChannelName] = useState('');
	const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});
	const [isLoading, setIsLoading] = useState(false);

	// Destructure errors for cleaner JSX
	const { message, name: nameError } = errors.errors;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({ errors: { message: '' } });

		if (!(channelName.trim() && currentServer)) {
			setErrors({
				errors: {
					message: '',
					name: 'Channel name is required',
				},
			});
			return;
		}

		setIsLoading(true);
		const serverResponse = await createChannel(currentServer.id, {
			name: formatChannelName(channelName),
			visibility,
		});

		if (serverResponse) {
			setErrors(serverResponse);
		} else {
			closeModal();
		}
		setIsLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-4 p-6'
			onKeyDown={(e) => {
				handleSubmitKeysDown(e, handleSubmit);
			}}
		>
			<h2 className='font-bold text-2xl'>Create Channel</h2>
			<div className='flex flex-col gap-2'>
				<label htmlFor='channelName' className='font-semibold text-sm'>
					Channel Name
				</label>
				<input
					type='text'
					id='channelName'
					value={channelName}
					onChange={(e) => {
						setChannelName(e.target.value);
					}}
					className='rounded-md bg-gray-700 p-2 text-white'
					placeholder='new-channel'
					required={true}
				/>
				{nameError && <p className='text-red-500 text-sm'>{nameError}</p>}
			</div>
			<div className='flex flex-col gap-2'>
				<label htmlFor='visibility' className='font-semibold text-sm'>
					Visibility
				</label>
				<select
					id='visibility'
					value={visibility}
					onChange={(e) => {
						setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE');
					}}
					className='rounded-md bg-gray-700 p-2 text-white'
				>
					<option value='PUBLIC'>Public</option>
					<option value='PRIVATE'>Private</option>
				</select>
			</div>
			{message && <p className='text-red-500 text-sm'>{message}</p>}
			<button
				type='submit'
				disabled={isLoading}
				className='cursor-pointer rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700'
			>
				Create Channel
			</button>
		</form>
	);
};
