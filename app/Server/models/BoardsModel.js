const dbBoards = require("../config/BoardDatabase.js");
const {DataTypes} = require("sequelize");

const Boards = dbBoards.define('boards_table', {
	board_name: {
		type: DataTypes.STRING
	},
	board_description: {
		type: DataTypes.TEXT("long")
	}
}, {
	freezeTableName: true
});

module.exports = Boards;