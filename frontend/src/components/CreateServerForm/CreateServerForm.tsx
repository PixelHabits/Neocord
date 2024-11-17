import type React from 'react';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';
import { handleSubmitKeysDown } from '../../utils/index.ts';

export const CreateServerForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: '',
		description: '',
	});
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});

	const { closeModal } = useModal();
	const { createServer, currentServer } = useStore();

	const { message, name: nameError } = errors.errors;

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
		setErrors({ errors: { message: '' } });

		if (!formData.name) {
			setErrors({
				errors: {
					message: '',
					name: 'Server name is required',
				},
			});
			return;
		}

		const serverResponse = await createServer(formData);

		if (serverResponse) {
			setErrors(serverResponse);
		} else {
			closeModal();
			setFormData({ name: '', description: '' });
			if (currentServer?.id) {
				navigate(`/servers/${String(currentServer.id)}`);
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
				onKeyDown={(e) => {
					handleSubmitKeysDown(e, handleSubmit);
				}}
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
					{nameError && (
						<span className='text-red-500 text-sm'>{nameError}</span>
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
				{message && <span className='text-red-500 text-sm'>{message}</span>}
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
