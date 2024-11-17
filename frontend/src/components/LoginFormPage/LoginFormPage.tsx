import type React from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store.ts';
import type { ApiError } from '../../types/index.ts';
import './LoginForm.css';

function LoginFormPage() {
	const navigate = useNavigate();
	const login = useStore((state) => state.login);
	const user = useStore((state) => state.user);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<ApiError>({
		errors: {
			message: '',
		},
	});

	const { message, email: emailError, password: passwordError } = errors.errors;

	if (user) return <Navigate to='/' replace={true} />;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({ errors: { message: '' } });

		const serverResponse = await login({
			email,
			password,
		});

		if (serverResponse) {
			setErrors(serverResponse);
		} else {
			navigate('/');
		}
	};

	return (
		<div>
			<h1 className='text-4xl'>Log In</h1>
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
				<button type='submit'>Log In</button>
			</form>
		</div>
	);
}

export { LoginFormPage };
