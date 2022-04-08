import React from "react";
import {useNavigate, useParams} from 'react-router-dom'

function Profile() {
	const navigate = useNavigate();
	const {userId} = useParams();
	return (
		<div>
			<h1>Profile for {userId}</h1>

			<button onClick={_ => {
				navigate('/login');
			}}>Logout
			</button>
		</div>
	);
}

export default Profile;