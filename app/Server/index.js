const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(express.json());

const db = mysql.createConnection({
	user: "root",
	host: "localhost",
	password: "password",
	database: "LoginSystem"
});

app.listen(3001, _ => {
	console.log("Server is running on port 3001");
});