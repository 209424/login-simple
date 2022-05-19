const {Sequelize} = require('sequelize');

const dbBoard = new Sequelize('db_board', 'toor', 'toor', {
	host: "mysql_board",
	dialect: "mysql"
});

module.exports = dbBoard;