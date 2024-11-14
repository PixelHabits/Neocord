import type React from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store.ts';
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
		const login = useStore((state) => state.login);
		const user = useStore((state) => state.user);
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [errors, setErrors] = useState<Record<string, string>>({});

		if (user) return <Navigate to='/' replace={true} />;

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();

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
			<>
      <h1>Log In</h1>
      {Object.keys(errors).length > 0 &&
        Object.keys(errors).map((key) => <p key={key}>{errors[key]}</p>)}
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
					{errors.email && <p>{errors.email}</p>}
					<label>
						Password
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required={true}
						/>
					</label>
					{errors.password && <p>{errors.password}</p>}
					<button type='submit'>Log In</button>
				</form>
			</>
		);
}

export { LoginFormPage };
