import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Axios from "axios";

function Profile() {
	const serverPort = 3001;
	const serverUrl = `http://localhost:${serverPort}`;
	const navigate = useNavigate();
	const {userId: profileOwnerUserId} = useParams();
	const [logoutButtonText, setLogoutButtonText] = useState('Logout');
	const [loggingOut, setLoggingOut] = useState(false);
	const [userName, setUserName] = useState('');
	const [isForeignProfile, setIsForeignProfile] = useState(true);
	const [nonForeignElements, setNonForeignElements] = useState(<></>);

	Axios.defaults.withCredentials = true;

	const getLoggedInUser = async () => {
		try {
			const response = await Axios.get(`${serverUrl}/login`);
			return response.data;
		}
		catch (error) {
			return error;
		}
	}

	const getProfileOwner = async () => {
		const response = await Axios.get(`${serverUrl}/users/${profileOwnerUserId}`);
		return response.data;
	}

	const onLoad = async () => {
		getProfileOwner().then(owner => {
			setUserName(owner.username);
		}).catch(error => {
			setUserName(error.response.data.message || error.message);
		});
		try {
			const user = await getLoggedInUser();
			if (user.id.toString() === profileOwnerUserId.toString()) {
				// NON-FOREIGN ELEMENTS
				setIsForeignProfile(false);
				setNonForeignElements(
					<div>
						<button onClick={handleLogoutClicked} disabled={loggingOut}>{logoutButtonText}</button>
						<button onClick={handleBoardsClicked}>Boards</button>
					</div>
				);
			}
			else {
				// NON-FOREIGN ELEMENTS
				setIsForeignProfile(true);
				setNonForeignElements(<></>);
			}
			return user;
		}
		catch (error) {
			console.error(error.response.data);
			return error;
		}
	}

	useEffect(_ => {
		(async _ => {
				try {
					let response = await onLoad();
					console.log('Profile loaded:');
					console.log(response);
				}
				catch (error) {
					console.log('Profile failed to load:');
					console.error(error.response);
				}
			}
		)();
	}, []);

	const handleLogoutClicked = _ => {
		setLogoutButtonText('Logging out...');
		setLoggingOut(true);
		// Wysyłanie żądania wylogowania na serwer
		Axios.post(`${serverUrl}/logout`, {})
			.then(_ => {
				navigate('/login');
			}).catch(err => {
			navigate('/login');
		});
	}

	const handleBoardsClicked = _ => {
		navigate(`/boards/${profileOwnerUserId}`);
	}

	return (
		<div>
			<h1>Profile for {profileOwnerUserId}</h1>
			<p>{userName}</p>
			{/* Tylko zalogowany widzi, co tu jest */}
			{nonForeignElements}
		</div>
	);
}

export default Profile;