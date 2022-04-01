const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'password',
	database: 'LoginSystem',
});

db.query("create table if not exists users (" +
	"id int unsigned auto_increment not null, " +
	"username varchar(255) not null, " +
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

db.query('select * from users',
	(err, result) => {
		if (err) {
			console.log('select error:');
			console.log(err);
		}
		else {
			console.log('select results:');
			console.log(result)
		}
	});

// on app posted
app.post('/register', (req, res) => {
	console.log('posted: %o', req.body)
	const username = req.body.username;
	const password = req.body.password;

	db.query('INSERT INTO users (username, password) VALUES (?, ?)',
		[username, password],
		(err, result) => {
			if (err) {
				console.log('Błąd: ' + err);
				res.status(500).send(err);
			}
			else {
				console.log('Wynik: %o', result);
				res.status(200).send(result);
			}
		});
});

const serverPort = 3001;
app.listen(serverPort, _ => {
	console.log(`Server is running on port ${serverPort}`);
});