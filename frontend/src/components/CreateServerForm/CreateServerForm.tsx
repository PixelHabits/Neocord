import type React from 'react';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import { handleSubmitKeysDown } from '../../utils/index.ts';

export const CreateServerForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const { closeModal } = useModal();
	const { createServer, currentServer } = useStore();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id.replace('server-', '')]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		if (!formData.name) {
			setErrors({ name: 'Server name is required' });
			return;
		}

		const result = await createServer(formData);

		if (result) {
			// Error case
			setErrors({
				server: result.server ?? 'An error occurred',
			});
		} else {
			// Success case
			closeModal();
			setFormData({ name: '', description: '' });
			if (currentServer?.id) {
				navigate(`/servers/${currentServer.id}`);
			}
		}
	};
	return (
		<div className='flex flex-col gap-4 rounded-lg bg-background p-4'>
			<div className='flex items-center justify-between'>
				<h1 className='font-bold text-2xl text-gray-200'>
					Create A New Server
				</h1>
				<button
					type='button'
					className='cursor-pointer rounded-md bg-gray-700 p-2 text-gray-400'
					onClick={closeModal}
				>
					Cancel
				</button>
			</div>

			<form
				className='flex flex-col gap-2 space-y-4'
				onSubmit={handleSubmit}
				onKeyDown={(e) => handleSubmitKeysDown(e, handleSubmit)}
			>
				<div className='flex flex-col gap-2'>
					<label htmlFor='server-name' className='font-bold text-gray-400'>
						Server Name
					</label>
					<input
						type='text'
						id='server-name'
						className='rounded-md bg-gray-700 p-2 text-gray-200'
						placeholder='Enter a name for your server'
						value={formData.name}
						onChange={handleChange}
					/>
					{errors.name && (
						<span className='text-red-500 text-sm'>{errors.name}</span>
					)}
				</div>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='server-description'
						className='font-bold text-gray-400'
					>
						Server Description
					</label>
					<textarea
						id='server-description'
						className='rounded-md bg-gray-700 p-2 text-gray-200'
						placeholder='Enter a description for your server'
						value={formData.description}
						onChange={handleChange}
					/>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						className='cursor-pointer rounded-md bg-gray-700 bg-primary p-2 text-gray-200'
					>
						Create
					</button>
				</div>
				{errors.server && (
					<span className='text-red-500 text-sm'>{errors.server}</span>
				)}
			</form>
		</div>
	);
};
