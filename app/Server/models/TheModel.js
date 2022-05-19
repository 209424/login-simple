const dbBoard = require("../config/BoardDatabase.js");
const {DataTypes, fn, col} = require("sequelize");

const Board_table = dbBoard.define('board_table', {
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

const Card_table = dbBoard.define('card_table', {
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

const User_table = dbBoard.define('user_table', {
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

Board_table.belongsToMany(User_table, {through: 'board_user'});
User_table.belongsToMany(Board_table, {through: 'board_user'});

// board_table.hasOne(user_table, {as: 'owner', foreignKey: 'owner_id'});
// user_table.hasMany(board_table, {foreignKey: 'owner_id'});

exports.Board_table = Board_table;
exports.User_table = User_table;
exports.Card_table = Card_table;