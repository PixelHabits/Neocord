import type React from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';

function SignupFormPage() {
	const navigate = useNavigate();
	const signup = useStore((state) => state.signup);
	const user = useStore((state) => state.user);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});

	const {
		message,
		email: emailError,
		username: usernameError,
		password: passwordError,
		confirmPassword: confirmPasswordError,
	} = errors.errors;

	if (user) return <Navigate to='/' replace={true} />;

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
			navigate('/');
		}
	};

	return (
		<>
			<h1>Sign Up</h1>
			{message && <p className='mt-2 text-red-500 text-sm'>{message}</p>}
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input
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
						type='password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required={true}
					/>
				</label>
				{confirmPasswordError && (
					<p className='text-red-500 text-sm'>{confirmPasswordError}</p>
				)}
				<button type='submit'>Sign Up</button>
			</form>
		</>
	);
}

export { SignupFormPage };
