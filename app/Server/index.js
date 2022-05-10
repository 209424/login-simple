const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("cookie-session");

const app = express();

app.use(express.json());
app.use(cors({
	origin: ["http://localhost:3000", "http://localhost:3009"],
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
const Users = require("./models/UserModel");

// on app posted to register
app.post('/register', (req, res) => {
	console.log('posted to register: %o', req.body)
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
			// Create table Users if not exists
			Users.sync().then(() => {
				// Insert new user
				Users.create({
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
			}).catch(err => {
				console.error('users sync error');
				// Klient widzi: error.response.data
				res.status(400).send({message: 'Internal server error'});
				console.log('Error in register:');
				console.log(err);
			});
		}
	});
});

// on app getted from login
app.get('/login', (req, res) => {
	// req.session.user może zawierać id i nazwę zalogowanego użytkownika lub undefined
	res.send(req.session?.user);
});

// on app posted to login
app.post('/login', (req, res) => {
	console.log('POST to login');
	const username = req.body.username;
	const password = req.body.password;

	// select user from Users where username = username or email = email
	Users.findOne({
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
		res.status(400).send({message: 'Internal server error'});
	});
});

app.get('/users/:userId', (req, res) => {
	const userId = req.params.userId;
	console.log('GET to user: ' + userId);
	Users.findOne({
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

// on app posted to logout
app.post('/logout', (req, res) => {
	console.log('Posted to logout:');
	console.log(req.session.user);
	// Kasowanie sesji użytkownika
	req.session.user = undefined;
	res.send({message: 'Logged out!'});
});

const serverPort = 3001;
app.listen(serverPort, _ => {
	console.log(`Server is running on port ${serverPort}`);
});