import type React from 'react';
import { type FormEvent, useState } from 'react';
import { useModal } from '../../context/useModal.ts';
import { servers } from '../ServerPage/mockServers.ts';

export const CreateServerForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});

	const { closeModal } = useModal();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id.replace('server-', '')]: value,
		}));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!formData.name) {
			return;
		}

		// Create new server
		const newServer = {
			id: servers.length + 1,
			name: formData.name,
			description: formData.description,
			channels: [],
		};

		// Add to servers array
		servers.push(newServer);

		// Close modal and reset form
		closeModal();
		setFormData({ name: '', description: '' });
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

			<form className='flex flex-col gap-2 space-y-4' onSubmit={handleSubmit}>
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
			</form>
		</div>
	);
};
