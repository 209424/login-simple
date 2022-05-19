import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import '../Styles/Login.css';
import {Link, useNavigate} from 'react-router-dom';

function Login() {
	// const serverPort = 3001;
	// const serverUrl = `http://localhost:${serverPort}`;
	const serverUrl = `api`;
	const navigate = useNavigate();

	// Variable and its setter
	const [usernameOrEmail, setUsernameOrEmail] = useState('');
	const [password, setPassword] = useState('');

	const [loginStatus, setLoginStatus] = useState('');

	Axios.defaults.withCredentials = true;

	const handleLoginClicked = event => {
		console.log('Login button clicked');
		Axios.post(`${serverUrl}/login`, {
			username: usernameOrEmail,
			email: usernameOrEmail,
			password: password
		}).then(response => {
			// LOGIN SUCCESSFUL
			handleSuccessfulLogin(response);
			console.log(response);
		}).catch(error => {
			let errorMessage = error.response?.data?.message || error.message;
			setLoginStatus(errorMessage);
		});
		event.preventDefault();
	};

	const handleSuccessfulLogin = response => {
		// response.data ≔ {id: 1, username: "admin"}
		console.log('Login successful');
		const userData = response.data;
		setLoginStatus(`Logging in: ${userData.username}`);
		const userId = userData.id;
		// redirect to application page
		navigate(`/profile/${userId}`);
	}

	// React.StrictMode renders components twice in development mode, useEffect is called twice if present.
	// useEffect pilnuje, aby strona logowania nie zniknęła przed wykonaniem funkcji.
	// Funkcja przekazana do useEffect zostanie uruchomiona po tym, jak zmiany zostaną wyświetlone na ekranie.
	// Domyślnie efekty są uruchamiane po każdym wyrenderowaniu komponentu.
	// Jeżeli zostanie przekazany drugi argument, to efekt zostanie uruchamiany tylko wtedy, gdy zmieni się właściwość argumentu.
	// Tutaj przekazano pustą tablicę, czyli funkcja wykona się tylko raz po odświeżeniu strony.
	useEffect(_ => {
		// Pobieranie danych logowania z serwera
		// Tam znajduje się session.user, czyli podstawowe dane o zalogowanym użytkowniku
		Axios.get(`${serverUrl}/login`).then(response => {
			// Jeżeli użytkownik pozostaje zalogowany, to wykonujemy funkcję, która normalnie jest wykonywana po logowaniu
			if (response.data?.id) {
				// LOGIN SUCCESSFUL
				handleSuccessfulLogin(response);
			}
		}).catch(error => {
			console.log(error);
		});
	}, []);

	return (
		<div className='login_page'>
			<div className='login'>
				<h1>Login</h1>
				<form id='login' className='login_form' onSubmit={handleLoginClicked}>
					<div className='form-group'>
						<label htmlFor='username'>Username or email</label>
						<input type='text' className='form-control' id='username' autoComplete='username'
						       placeholder='Enter username or email'
						       value={usernameOrEmail}
						       onChange={e => {
							       setUsernameOrEmail(e.target.value)
						       }}/>
					</div>
					<div className='form-group'>
						<label htmlFor='password'>Password</label>
						<input type='password' className='form-control' id='password' autoComplete='password'
						       placeholder='Enter password'
						       value={password}
						       onChange={e => setPassword(e.target.value)}/>
					</div>
					<input type="submit" value="Log in"/>
					<p>{loginStatus}</p>
				</form>

				<p>If you don't have an account, <Link to='/register'>register</Link></p>
			</div>
		</div>
	);
}

export default Login;