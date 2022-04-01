const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(cors());

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

// on app posted
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