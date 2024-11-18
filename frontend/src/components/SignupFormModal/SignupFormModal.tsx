import type React from 'react';
import { useState } from 'react';
import { useModal } from '../../context/useModal.ts';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';
import './SignupForm.css';

function SignupFormModal() {
	const signup = useStore((state) => state.signup);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});
	const { closeModal } = useModal();

	// Destructure errors for cleaner JSX
	const {
		message,
		email: emailError,
		username: usernameError,
		password: passwordError,
		confirmPassword: confirmPasswordError,
	} = errors.errors;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({ errors: { message: '' } });

		if (password !== confirmPassword) {
			return setErrors({
				errors: {
					message: '',
					confirmPassword:
						'Confirm Password field must be the same as the Password field',
				},
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
			{message && <p className='mt-2 text-red-500 text-sm'>{message}</p>}
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
				{emailError && <p className='text-red-500 text-sm'>{emailError}</p>}
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
				{usernameError && (
					<p className='text-red-500 text-sm'>{usernameError}</p>
				)}
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
				{passwordError && (
					<p className='text-red-500 text-sm'>{passwordError}</p>
				)}
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
				{confirmPasswordError && (
					<p className='text-red-500 text-sm'>{confirmPasswordError}</p>
				)}
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
