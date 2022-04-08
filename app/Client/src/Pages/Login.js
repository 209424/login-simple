import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import '../Styles/Login.css';
import {useNavigate} from 'react-router-dom';

function Login() {

	const serverPort = 3001;
	const navigate = useNavigate();

	// Variable and its setter
	const [usernameReg, setUsernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [loginStatus, setLoginStatus] = useState('');

	Axios.defaults.withCredentials = true;

	const handleRegisterClicked = _ => {
		console.log('registering: ' + usernameReg + ' ' + passwordReg);
		Axios.post(`http://localhost:${serverPort}/register`, {
			username: usernameReg,
			password: passwordReg
		}).then(response => {
			console.log(response);
		}).catch(error => {
			console.log(error);
		});
	}

	const handleLoginClicked = _ => {

		console.log('logging in: ' + username + ' ' + password);
		Axios.post(`http://localhost:${serverPort}/login`, {
			username: username,
			password: password
		}).then(response => {
			if (response.data.message) {
				setLoginStatus(response.data.message);
			}
			else if (response.data.error) {
				setLoginStatus(response.data.error.code);
			}
			else {
				// LOGIN SUCCESSFUL
				handleSuccessfulLogin(response);
			}
			console.log(response);
		}).catch(error => {
			console.log(error);
		});
	};

	const handleSuccessfulLogin = response => {
		console.log('login successful');
		setLoginStatus(response.data[0].username);
		const userId = response.data[0].id;
		// redirect to application page
		navigate(`/profile/${userId}`);
	}

	// React.StrictMode renders components twice in development mode, that's why useEffect is called twice
	// Cookies
	useEffect(_ => {
		Axios.get(`http://localhost:${serverPort}/login`).then(response => {
			//console.log(response);
			if (response.data.loggedIn === true) {
				// LOGIN SUCCESSFUL
				handleSuccessfulLogin(response);
			}
		}).catch(error => {
			console.log(error);
		});
	}, []);

	return (
		<div className='login_page'>
			<div className='registration'>
				<h1>Registration</h1>
				<label>Username</label>
				<input type='text' onChange={event => {
					setUsernameReg(event.target.value);
				}}/>
				<label>Password</label>
				<input type='password' onChange={event => {
					setPasswordReg(event.target.value);
				}}/>
				<button onClick={handleRegisterClicked}>Register</button>
			</div>

			<div className='login'>
				<h1>Login</h1>
				<input type='text' placeholder='Username' onChange={event => {
					setUsername(event.target.value);
				}}/>
				<input type='password' placeholder='Password' onChange={event => {
					setPassword(event.target.value);
				}}/>
				<button onClick={handleLoginClicked}>Login</button>
			</div>

			<h2>{loginStatus}</h2>
		</div>
	);
}

export default Login;