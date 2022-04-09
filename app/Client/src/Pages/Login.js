import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import '../Styles/Login.css';
import {Link, useNavigate} from 'react-router-dom';

function Login() {

	const serverPort = 3001;
	const navigate = useNavigate();

	// Variable and its setter
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [loginStatus, setLoginStatus] = useState('');

	Axios.defaults.withCredentials = true;

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
		const userData = response.data[0] ? response.data[0] : response.data.user[0];
		setLoginStatus(userData.username);
		const userId = userData.id;
		// redirect to application page
		navigate(`/profile/${userId}`);
	}

	// React.StrictMode renders components twice in development mode, that's why useEffect is called twice
	// Check if a user remains logged in (cookies)
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
			<div className='login'>
				<h1>Login</h1>
				<input type='text' placeholder='Username' onChange={event => {
					setUsername(event.target.value);
				}}/>
				<input type='password' placeholder='Password' onChange={event => {
					setPassword(event.target.value);
				}}/>
				<button onClick={handleLoginClicked}>Login</button>

				<p>If you don't have an account, <Link to='/register'>register</Link>.</p>
			</div>

			<h2>{loginStatus}</h2>
		</div>
	);
}

export default Login;