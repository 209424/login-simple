const {Sequelize} = require('sequelize');

const dbBoards = new Sequelize('simple_board', 'toor', 'toor', {
	host: "mysql_boards",
	dialect: "mysql"
});

module.exports = dbBoards;