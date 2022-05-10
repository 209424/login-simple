const {Sequelize} = require('sequelize');

const dbAuth = new Sequelize('simple_auth', 'toor', 'toor', {
	host: "mysql_auth",
	dialect: "mysql"
});

module.exports = dbAuth;