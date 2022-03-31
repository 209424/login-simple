const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "password",
	database: "LoginSystem"
});

app.post('/register', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	db.query('INSERT INTO users (username, password) VALUES (?, ?)',
		[username, password],
		(err, result) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(result);
		}
	});
});

app.listen(3001, _ => {
	console.log("Server is running on port 3001");
});