import type React from 'react';
import { useState } from 'react';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import './SignupForm.css';

interface SignupErrors {
	email?: string;
	username?: string;
	password?: string;
	confirmPassword?: string;
	server?: string;
}
function SignupFormModal() {
	const signup = useStore((state) => state.signup);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<SignupErrors>({});
	const { closeModal } = useModal();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return setErrors({
				confirmPassword:
					'Confirm Password field must be the same as the Password field',
			});
		}

		const serverResponse = await signup({
			email,
			username,
			password,
		});

		if (serverResponse) {
			setErrors(serverResponse);
		} else {
			closeModal();
		}
	};

	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='text-4xl'>Sign Up</h1>
			{errors.server && <p>{errors.server}</p>}
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input
						className='w-full rounded-md border-1 border-gray-300 p-2'
						type='text'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required={true}
					/>
				</label>
				{errors.email && <p>{errors.email}</p>}
				<label>
					Username
					<input
						className='w-full rounded-md border-1 border-gray-300 p-2'
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required={true}
					/>
				</label>
				{errors.username && <p>{errors.username}</p>}
				<label>
					Password
					<input
						className='w-full rounded-md border-1 border-gray-300 p-2'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required={true}
					/>
				</label>
				{errors.password && <p>{errors.password}</p>}
				<label>
					Confirm Password
					<input
						className='w-full rounded-md border-1 border-gray-300 p-2'
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required={true}
					/>
				</label>
				{errors.confirmPassword && <p>{errors.confirmPassword}</p>}
				<button
					className='mt-4 w-full cursor-pointer rounded-md border-1 border-gray-300 bg-neutral-800 p-2 text-white hover:bg-neutral-900'
					type='submit'
				>
					Sign Up
				</button>
			</form>
		</div>
	);
}

export { SignupFormModal };
