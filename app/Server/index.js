const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

const app = express();

app.use(express.json());
app.use(cors({
	origin: ["http://localhost:3000"],
	methods: ["GET", "POST"],
	credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	key: "userId",
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		//maxAge: 1000 * 60 * 60 * 24 // 1d
		maxAge: 1000 * 60 * 3 // 3min
	}
}));

const bcrypt = require("bcrypt");
const saltRounds = 10;

const {Op} = require('sequelize')

const model = require("./models/TheModel");
let Board_table = model.Board_table;
let User_table = model.User_table;
let Card_table = model.Card_table;

// Tworzenie tabel, jeżeli nie istnieją
(async () => {
	try {
		console.log('Syncing database...');
		await User_table.sync();
		await Board_table.sync();
		await Card_table.sync();
		console.log('Database synced.');
	}
	catch (err) {
		console.error('Database sync error:');
		console.error(err);
	}
})()

app.post('/register', (req, res) => {
	console.log('POST to register');
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err) {
			console.error('Register error');
			console.log('hash error:');
			console.log(err);
		}
		else {
			// Tworzenie nowego użytkownika
			User_table.create({
				username: username,
				email: email,
				password: hash
			}).then(result => {
				console.log('Created user: ' + result.username);
				res.send(result);
			}).catch(err => {
				let commonError = err.errors?.[0];

				console.error('Register error');
				if (commonError)
					res.status(400).send({
						errorBody: {
							path: commonError.path,
							type: commonError.type
						}
					});
				else
					res.status(400).send({message: 'Internal server error'});
				console.log('Error in register:');
				console.log(err);
			});
		}
	});
});

app.get('/login', (req, res) => {
	// req.session.user może zawierać id i nazwę zalogowanego użytkownika lub undefined
	res.send(req.session?.user);
});

app.post('/login', (req, res) => {
	console.log('POST to login');
	const username = req.body.username;
	const password = req.body.password;

	// select user from User where username = username or email = email
	User_table.findOne({
		where: {
			[Op.or]: [{username: username}, {email: username}]
		}
	}).then(result => {
		if (result) {
			let userdata = result.dataValues;
			bcrypt.compare(password, userdata.password, (err, response) => {
				if (response) {
					// Hasło itd. nie jest już potrzebne
					// Przekazujemy tylko id i nazwę użytkownika do obiektu sesji i klienta
					let publicUserData = {
						id: userdata.id,
						username: userdata.username
					};
					req.session.user = publicUserData;
					console.log(req.session.user);
					res.send(publicUserData);
				}
				else {
					res.status(400).send({message: 'Wrong password!'});
				}
			});
		}
		else {
			console.log('login failed');
			res.status(400).send({message: 'User doesn\'t exist!'});
		}
	}).catch(err => {
		console.log('select error');
		console.error(err);
		res.status(400).send({message: 'Internal server error'});
	});
});

app.get('/users/:userId', (req, res) => {
	const userId = req.params.userId;
	console.log(`GET to users/${userId}`);
	User_table.findOne({
		where: {
			id: userId
		}
	}).then(result => {
		if (result) {
			let publicUserData = {
				id: result.dataValues.id,
				username: result.dataValues.username
			};
			res.send(publicUserData);
		}
		else
			res.status(400).send({message: 'User doesn\'t exist!'});
	}).catch(err => {
		console.log('select error');
		res.status(400).send({message: 'Internal server error'});
	});
});

app.post('/logout', (req, res) => {
	console.log('POST to logout:');
	console.log(req.session.user);
	// Kasowanie sesji użytkownika
	req.session.user = undefined;
	res.send({message: 'Logged out!'});
});

app.post('/boards/create/:userId', async (req, res) => {
	const userId = req.params.userId;
	console.log(`POST to boards/create/${userId}`);
	const loggedInUserId = req.session.user.id;
	// jeżeli id zalogowanego użytkownika jest równe id właściciela tablicy
	// noinspection EqualityComparisonWithCoercionJS
	if (loggedInUserId == userId) {
		console.log('Creating board for: ' + userId);

		const title = req.body.title;
		const description = req.body.description;

		const user = await User_table.findOne({
			where: {
				id: userId
			}
		});

		const board = await Board_table.create({
			title: title,
			description: description,
			owner_id: userId
		});

		// todo: TypeError: User_table.addBoard_table is not a function
		// await user.addBoard_table(board);

		res.send(board);
	}
	else {
		res.status(400).send({message: 'You are not allowed to create board for this user!'});
	}
});

app.get('/boards/:userId', async (req, res) => {
	const userId = req.params.userId;
	console.log(`GET to boards/${userId}`);
	let boards = await Board_table.findAll({
		where: {
			owner_id: userId
		}
	});

	res.send(boards);
});

app.get('/cards/:userId', async (req, res) => {
	const userId = req.params.userId;
	console.log(`GET to cards/${userId}`);
	let cards = await Card_table.findAll({
		where: {
			owner_id: userId
		}
	});

	res.send(cards);
});

app.post('/cards/create/:userId', async (req, res) => {
	const userId = req.params.userId;
	console.log(`POST to cards/create/${userId}`);
	console.log(req.body);
	const loggedInUserId = req.session.user.id;
	// jeżeli id zalogowanego użytkownika jest równe id właściciela tablicy
	// noinspection EqualityComparisonWithCoercionJS
	if (/*loggedInUserId == userId*/true) {
		console.log('Creating card for: ' + userId);

		const title = req.body.title;
		const description = req.body.description;

		const user = await User_table.findOne({
			where: {
				id: userId
			}
		});

		const card = await Card_table.create({
			title: title,
			description: description,
			owner_id: userId
		});

		// todo: TypeError: User_table.addBoard_table is not a function
		// await user.addCard_table(card);

		res.send(card);
	}
	else {
		res.status(400).send({message: 'You are not allowed to create board for this user!'});
	}
});

app.delete('/cards/delete/:cardId', async (req, res) => {
	const cardId = req.params.cardId;
	console.log(`DELETE to cards/delete/${cardId}`);

	const cardToDelete = await Card_table.findOne({
		where: {
			id: cardId
		}
	});
	await cardToDelete.destroy();
	res.send({message: 'Card deleted!'});
});

app.put('/cards/update/:cardId', async (req, res) => {
	const cardId = req.params.cardId;
	console.log(`PUT to cards/update/${cardId}`);
	console.log(req.body);

	const title = req.body.title;
	const description = req.body.description;

	const cardToUpdate = await Card_table.findOne({
		where: {
			id: cardId
		}
	});

	await cardToUpdate.update({
		title: title,
		description: description
	});

	res.send({message: 'Card updated!'});
});

const serverPort = 3001;
app.listen(serverPort, _ => {
	console.log(`Server is running on port ${serverPort}`);
});