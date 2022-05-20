const dbBoard = require("../config/BoardDatabase.js");
const {DataTypes, fn, col} = require("sequelize");

// todo: użytkownicy z prawem do edycji
const Board = dbBoard.define('board', {
	title: {
		type: DataTypes.STRING
	},
	description: {
		type: DataTypes.TEXT("long")
	},
	owner_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		foreignKey: true
	}
}, {
	freezeTableName: true,
	timestamps: false
});

const Card = dbBoard.define('card', {
	title: {
		type: DataTypes.STRING
	},
	description: {
		type: DataTypes.TEXT("long")
	},
	owner_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		foreignKey: true
	}
}, {
	freezeTableName: true,
	timestamps: false
});

const User = dbBoard.define('user', {
	username: {
		type: DataTypes.STRING(50),
		allowNull: false,
		unique: {
			args: true,
			message: 'Username must be unique.',
			fields: [fn('lower', col('username'))]
		},
		validate: {
			notEmpty: {
				msg: 'Username is required'
			},
			len: {
				args: [1, 50],
				msg: 'Username must be between 1 and 50 characters'
			}
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: {
			args: true,
			message: 'Email must be unique.',
			fields: [fn('lower', col('username'))]
		},
		validate: {
			isEmail: {
				msg: 'Invalid email'
			}
		}
	},
	password: {
		type: DataTypes.CHAR(60),
		allowNull: false
	},
	refresh_token: {
		type: DataTypes.TEXT
	}
}, {
	freezeTableName: true
});

const BoardUser = dbBoard.define("board_user",
	{},
	{timestamps: false}
);

const CardUser = dbBoard.define("card_user",
	{},
	{timestamps: false}
);

Board.belongsToMany(User, {through: BoardUser});
User.belongsToMany(Board, {through: BoardUser});

Card.belongsToMany(User, {through: CardUser});
User.belongsToMany(Card, {through: CardUser});

// board_table.hasOne(user_table, {as: 'owner', foreignKey: 'owner_id'});
// user_table.hasMany(board_table, {foreignKey: 'owner_id'});

exports.Board = Board;
exports.Card = Card;
exports.User = User;

exports.BoardUser = BoardUser;
exports.CardUser = CardUser;