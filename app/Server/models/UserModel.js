const dbAuth = require("../config/AuthDatabase.js");
const {DataTypes, fn, col} = require("sequelize");

const Users = dbAuth.define('users', {
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

module.exports = Users;