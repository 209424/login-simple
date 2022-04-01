import React, {useState} from 'react';
import Axios from 'axios';
import './App.css';

function App() {
	const serverPort = 3001;

	const [usernameReg, setUsernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [loginStatus, setLoginStatus] = useState('');

	const register = _ => {
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

	function login() {
		console.log('logging in: ' + username + ' ' + password);
		Axios.post(`http://localhost:${serverPort}/login`, {
			username: username,
			password: password
		}).then(response => {
			if (response.data.message) {
				setLoginStatus(response.data.message);
			} else {
				setLoginStatus(response.data[0].username);
			}
			console.log(response);
		}).catch(error => {
			console.log(error);
		});
	}

	return (
		<div className='App'>
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
				<button onClick={register}>Register</button>
			</div>

			<div className='login'>
				<h1>Login</h1>
				<input type='text' placeholder='Username' onChange={event => {
					setUsername(event.target.value);
				}}/>
				<input type='password' placeholder='Password' onChange={event => {
					setPassword(event.target.value);
				}}/>
				<button onClick={login}>Login</button>
			</div>

			<h2>{loginStatus}</h2>
		</div>
	);
}

export default App;