export default {
	env: process.env.NODE_ENV,
	serverPort: process.env.SERVER_PORT,
	authDb: process.env.AUTH_DB,
	boardsDb: process.env.BOARDS_DB,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
};