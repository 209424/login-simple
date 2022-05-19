import '../../Styles/Boards.css';
import {useParams} from 'react-router-dom';
import {useState} from "react";
import Axios from "axios";

function Boards() {
	// const serverPort = 3001;
	// const serverUrl = `http://localhost:${serverPort}`;
	const serverUrl = `/api`;
	const {userId: boardOwnerUserId} = useParams();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [boardList, setBoardList] = useState([]);

	const addBoard = _ => {
		Axios.post(`${serverUrl}/boards/create/${boardOwnerUserId}`, {
			title: title,
			description: description
		}).then(response => {
			console.log(response);
		}).catch(error => {
			console.log(error.response?.data?.message || error.message);
		});
	};

	const getBoards = _ => {
		Axios.get(`${serverUrl}/boards/${boardOwnerUserId}`, {params: {userId: boardOwnerUserId}})
			.then(response => {
			console.log(response);
		}).catch(error => {
			console.log(error.response?.data?.message || error.message);
		});
	};

	return (
		<div className='Boards'>
			<div className='information'>
				<h1>Boards</h1>
				<label>Title:</label>
				<input type='text' onChange={e => {
					setTitle(e.target.value)
				}}/>
				<label>Description:</label>
				<input type='text' onChange={e => {
					setDescription(e.target.value)
				}}/>
				<button onClick={addBoard}>Add</button>
			</div>
			<hr/>
			<div className='content'>
				<h1>Content</h1>
				<button onClick={getBoards}>Get</button>
			</div>
		</div>

	);
}

export default Boards;