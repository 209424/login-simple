const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

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
	secret: "secret",
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 1000 * 60 * 60 * 24 // 1d
	}
}));

const db = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'password',
	database: 'LoginSystem',
});

// CREATING TABLE ↓↓↓
db.query("create table if not exists users (" +
	"id int unsigned auto_increment not null, " +
	"username varchar(45) not null, " +
	"password varchar(255) not null, " +
	"primary key (id))",
	(err, result) => {
		if (err) {
			console.log('create table error:');
			console.log(err);
		}
		else {
			console.log('created table users:');
			console.log(result)
		}
	});
// CREATING TABLE ↑↑↑

// on app posted to register
app.post('/register', (req, res) => {
	console.log('posted to register: %o', req.body)
	const username = req.body.username;
	const password = req.body.password;

	bcrypt.hash(password, saltRounds, (err, hash) => {
		if (err) {
			console.log('hash error:');
			console.log(err);
		}
		else {
			db.query('insert into users (username, password) values (?, ?)',
				[username, hash],
				(err, result) => {
					if (err) {
						console.log('insert error:');
						console.log(err);
					}
					else {
						console.log('insert results:');
						console.log(result)
						res.send(result);
					}
				});
		}
	});
});

// on app getted from login
app.get('/login', (req, res) => {
	if (req.session.user) {
		res.send({loggedIn: true, user: req.session.user});
	}
	else {
		res.send({loggedIn: false});
	}
})

// on app posted to login
app.post('/login', (req, res) => {
	console.log('posted to login: %o', req.body)
	const username = req.body.username;
	const password = req.body.password;

	db.query('SELECT * FROM users WHERE username = ?',
		[username],
		(err, result) => {
			if (err) {
				console.log('select error: ' + err);
				res.send({error: err});
			}
			if (result.length > 0) {
				console.log('select result: %o', result);
				bcrypt.compare(password, result[0].password, (err, response) => {
					if (response) {
						req.session.user = result;
						console.log(req.session.user);
						res.send(result)
					}
					else {
						res.send({message: 'Wrong username or password!'})
					}
				});
			}
			else {
				console.log('login failed');
				res.send({message: 'User doesn\'t exist!'})
			}
		});
});

const serverPort = 3001;
app.listen(serverPort, _ => {
	console.log(`Server is running on port ${serverPort}`);
});