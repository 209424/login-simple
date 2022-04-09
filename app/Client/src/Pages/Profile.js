import React, {useState} from "react";
import {useNavigate, useParams} from 'react-router-dom'
import Axios from "axios";

function Profile() {
	const serverPort = 3001;
	const navigate = useNavigate();
	const {userId} = useParams();
	const [logoutButtonText, setLogoutButtonText] = useState('Logout');

	return (
		<div>
			<h1>Profile for {userId}</h1>

			<button onClick={_ => {
				setLogoutButtonText('Logging out...');
				Axios.post(`http://localhost:${serverPort}/logout`, {})
					.then(response => {
						navigate('/login');
					});
			}}>{logoutButtonText}
			</button>
		</div>
	);
}

export default Profile;