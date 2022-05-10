import React, {useEffect, useState} from 'react';
import Axios from 'axios';
import '../Styles/Login.css';
import {Link, useNavigate} from 'react-router-dom';
import validator from 'validator';

function Register() {
	const serverPort = 3001;
	const serverUrl = `http://localhost:${serverPort}`;
	const navigate = useNavigate();

	// Variable and its setter
	const [usernameReg, setUsernameReg] = useState('');
	const [emailReg, setEmailReg] = useState('');
	const [passwordReg, setPasswordReg] = useState('');

	const [usernameError, setUsernameError] = useState('Username must be between 1 and 50 characters');
	const [emailError, setEmailError] = useState('Invalid email');
	const [passwordError, setPasswordError] = useState('Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number or special character');
	const [registerStatus, setRegisterStatus] = useState('');
	const [registerDataValid, setRegisterDataValid] = useState(false);

	Axios.defaults.withCredentials = true;

	const handleRegisterClicked = event => {
		setRegisterStatus('');
		console.log('Register clicked');
		Axios.post(`${serverUrl}/register`, {
			username: usernameReg,
			email: emailReg,
			password: passwordReg
		}).then(response => {
			console.log('Registered: ' + usernameReg);

			// Login
			Axios.post(`${serverUrl}/login`, {
				username: usernameReg,
				email: emailReg,
				password: passwordReg
			}).then(loginResponse => {
				if (loginResponse.data.message) {
					setRegisterStatus(loginResponse.data.message);
				}
				else if (loginResponse.data.error) {
					setRegisterStatus(loginResponse.data.error.code);
				}
				else {
					// LOGIN SUCCESSFUL
					console.log('Login successful');
					const userData = loginResponse.data;
					setRegisterStatus(`Logging in: ${userData.username}`);
					const userId = userData.id;
					// redirect to application page
					navigate(`/profile/${userId}`);
				}
				console.log(loginResponse);
			}).catch(error => {
				console.log(error);
			});

		}).catch(error => {
			let errorMessage = error.response?.data?.message;
			let errorBody = error.response?.data?.errorBody;
			console.error('Register error.');
			// Jeżeli to znany błąd
			if (errorBody) {
				// I znany typ błędu
				if (errorBody.type === 'unique violation') {
					if (errorBody.path === 'username') {
						setRegisterStatus('This username already exists');
					}
					else if (errorBody.path === 'email') {
						setRegisterStatus('This email already exists');
					}
				}
				else if (errorBody.type === 'Validation error') {
					if (errorBody.path === 'username') {
						setRegisterStatus('Username invalid');
					}
					else if (errorBody.path === 'email') {
						setRegisterStatus('Email invalid');
					}
				}
			}
			else {
				// Jeżeli to nieznany błąd, którego nie da się obsłużyć
				// todo: login nie może zawierać samych białych znaków
				// todo: powtórzenie hasła
				console.log(`${error.message} - ${errorMessage}`);
				setRegisterStatus(`${error.message} - ${errorMessage}`);
			}

		});
		event.preventDefault();
	}

	// Jeżeli dane rejestracji są poprawne, to można kliknąć przycisk rejestracji
	useEffect(_ => {
		setRegisterDataValid(usernameError.length === 0 && emailError.length === 0 && passwordError.length === 0);
	}, [usernameError, emailError, passwordError]);


	const handleUsernameChange = event => {
		let username = event.target.value;
		setUsernameReg(username);
		if (username.length > 0 && username.length <= 50)
			setUsernameError('');
		else
			setUsernameError('Username must be between 1 and 50 characters');
	}

	const handleEmailChange = event => {
		let email = event.target.value;
		setEmailReg(email);
		if (validator.default.isEmail(email))
			setEmailError('');
		else
			setEmailError('Invalid email');
	}

	const handlePasswordChange = event => {
		let password = event.target.value;
		setPasswordReg(password);
		if (/^(?=.{8,255})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()])/.test(password))
			setPasswordError('');
		else
			setPasswordError('Password must contain at least 8 characters, ' +
				'one uppercase letter, one lowercase letter and one number or special character');
	}

	return (
		<div className='login_page'>
			<h1>Registration</h1>
			<form id='register' className='register_form' onSubmit={handleRegisterClicked}>
				<div className='form-group'>
					<label htmlFor='username'>Username</label>
					<input type='text' className='form-control' id='username' placeholder='Enter username'
					       value={usernameReg}
					       onChange={handleUsernameChange}/>
				</div>
				<p className='error'>{usernameError}</p>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input type='email' className='form-control' id='email' placeholder='Enter email'
					       value={emailReg}
					       onChange={handleEmailChange}/>
				</div>
				<p className='error'>{emailError}</p>
				<div className='form-group'>
					<label htmlFor='password'>Password</label>
					<input type='password' className='form-control' id='password' placeholder='Enter password'
					       value={passwordReg}
					       onChange={handlePasswordChange}/>
				</div>
				<p className='error'>{passwordError}</p>
				<input type="submit" value="Register" disabled={!registerDataValid}/>
				<p>{registerStatus}</p>
			</form>

			<p>If you already have an account, <Link to='/login'>log in</Link>.</p>
		</div>
	);
}

export default Register;