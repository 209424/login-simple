import '../../Styles/Boards.css';
import React, {Component} from 'react';
import axios from 'axios';
import {Button, Container, Card, Row} from 'react-bootstrap'

class Cards extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userId: '1',
			card_title: '',
			card_description: '',
			fetchData: []
		};
	}

	handleChange = (event) => {
		let name = event.target.name;
		let value = event.target.value;
		this.setState({
			[name]: value
		});
	};

	handleChange2 = (event) => {
		this.setState({
			description: event.target.value
		});
	};

	componentDidMount() {
		axios.get(`/api/cards/${this.state.userId}`)
			.then((response) => {
				this.setState({
					fetchData: response.data
				});
			});
	};

	submit = () => {
		axios.post(`/api/cards/create/${this.state.userId}`, {
			title: this.state.title,
			description: this.state.description
		})
			.then(() => {
				alert('success post')
			})
		console.log(this.state);
		document.location.reload();
	};

	delete = (id) => {
		if (window.confirm("Do you want to delete? ")) {
			axios.delete(`/api/cards/delete/${id}`);
			document.location.reload();
		}
	};

	edit = (id) => {
		axios.put(`/api/cards/update/${id}`, {
			description: this.state.description
		});
		document.location.reload();
	};

	render() {
		let card = this.state.fetchData.map((val, key) => {
			return (
				<React.Fragment>
					<Card style={{width: '18rem'}} className='m-2'>
						<Card.Body>
							<Card.Title>{val.title}</Card.Title>
							<Card.Text>
								{val.description}
							</Card.Text>
							<input name='descriptionUpdate' onChange={this.handleChange2} placeholder='Update description'></input>
							<Button className='m-2' onClick={() => {
								this.edit(val.id);
							}}>Update</Button>
							<Button onClick={() => {
								this.delete(val.id);
							}}>Delete</Button>
						</Card.Body>
					</Card>
				</React.Fragment>
			);
		});

		return (
			<div className='Cards'>
				<h1>Dockerized Fullstack React Application</h1>
				<div className='card_form'>
					<input name='title' placeholder='Enter Card Title' onChange={this.handleChange}/>
					<input name='description' placeholder='Enter Description' onChange={this.handleChange}/>
				</div>
				<Button className='my-2' variant="primary" onClick={this.submit}>Submit</Button> <br/><br/>
				<Container>
					<Row>
						{card}
					</Row>
				</Container>
			</div>
		);
	};
}

export default Cards;
