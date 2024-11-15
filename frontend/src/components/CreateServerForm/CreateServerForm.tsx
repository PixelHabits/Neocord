import { BiX } from 'react-icons/bi';
import React, { FormEvent, useState } from 'react';
import { useModal } from '../../context/useModal';
import { servers } from '../ServerPage/mockServers';

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
		<div className='flex flex-col gap-4 bg-background p-4 rounded-lg'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-200'>
					Create A New Server
				</h1>
				<button
					type='button'
					className='text-gray-400 bg-gray-700 cursor-pointer p-2 rounded-md'
					onClick={closeModal}
				>
					Cancel
				</button>
			</div>

			<form className='flex flex-col gap-2 space-y-4' onSubmit={handleSubmit}>
				<div className='flex flex-col gap-2'>
					<label htmlFor='server-name' className='text-gray-400 font-bold'>
						Server Name
					</label>
					<input
						type='text'
						id='server-name'
						className='bg-gray-700 p-2 rounded-md text-gray-200'
						placeholder='Enter a name for your server'
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='server-description'
						className='text-gray-400 font-bold'
					>
						Server Description
					</label>
					<textarea
						id='server-description'
						className='bg-gray-700 p-2 rounded-md text-gray-200'
						placeholder='Enter a description for your server'
						value={formData.description}
						onChange={handleChange}
					/>
				</div>
				<div className='flex justify-end'>
					<button
						type='submit'
						className='bg-primary text-gray-200 p-2 rounded-md bg-gray-700 cursor-pointer'
					>
						Create
					</button>
				</div>
			</form>
		</div>
	);
};
