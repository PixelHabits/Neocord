import type React from 'react';
import { type FormEvent, useState } from 'react';
import { DeleteServerConfirmation } from '../../DeleteServerConfirmation/DeleteServerConfirmation.tsx';
import { OpenModalButton } from '../../OpenModalButton/OpenModalButton.tsx';

export const EditServerSidebar = ({ server, onUpdateServer }) => {
	const [formData, setFormData] = useState({
		name: server.name,
		description: server.description,
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onUpdateServer({
			...server,
			...formData,
		});
		alert('updated');
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id.replace('server', '').toLowerCase()]: value,
		}));
	};
	return (
		<div className='col-span-1 m-4 flex h-full w-[calc(100%-2rem)] flex-col justify-between space-y-4 self-center justify-self-center rounded-r-lg bg-gray-700 p-4'>
			<div>
				<h3 className='font-bold text-gray-400 text-xl'>Edit Server</h3>
				<p className='text-gray-400 text-sm'>Edit this server&apos;s details</p>
				<form onSubmit={handleSubmit} className='my-8 flex flex-col gap-4'>
					<div className='flex flex-col gap-2'>
						<label
							htmlFor='serverName'
							className='font-bold text-gray-400 text-sm'
						>
							Server Name
						</label>
						<input
							type='text'
							id='serverName'
							className='rounded-md bg-gray-800 p-2 text-gray-400 focus:outline-none'
							value={formData.name}
							onChange={handleChange}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<label
							htmlFor='serverDescription'
							className='font-bold text-gray-400 text-sm'
						>
							Server Description
						</label>
						<textarea
							id='serverDescription'
							className='rounded-md bg-gray-800 p-2 text-gray-400 focus:outline-none'
							value={formData.description}
							onChange={handleChange}
						/>
					</div>
					<div className='flex justify-end'>
						<button
							type='submit'
							className='cursor-pointer rounded-md bg-gray-800 p-2 text-white hover:bg-gray-900'
						>
							Save
						</button>
					</div>
				</form>
			</div>

			{/* Members */}
			<div className='flex flex-col gap-2'>
				<h3 className='font-bold text-gray-400 text-xl'>Members</h3>
				<p className='text-gray-400 text-sm'>View members of this server</p>
			</div>

			{/* Danger Zone: Delete Server */}
			<div className='flex flex-col gap-2'>
				<h3 className='font-bold text-gray-400 text-xl'>Danger Zone</h3>
				<p className='text-gray-400 text-sm'>
					Delete this server and all of its channels
				</p>
				<OpenModalButton
					modalComponent={<DeleteServerConfirmation />}
					buttonText='Delete Server'
					className='cursor-pointer rounded-md bg-red-500 p-2 text-white'
				/>
			</div>
		</div>
	);
};
