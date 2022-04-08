import React, {useState} from 'react';
import Axios from 'axios';
import '../Styles/Login.css';
import {Link} from 'react-router-dom';

function Register() {
	const serverPort = 3001;

	// Variable and its setter
	const [usernameReg, setUsernameReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

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

				<p>If you already have an account, <Link to='/login'>log in</Link>.</p>
			</div>
		</div>
	);
}

export default Register;