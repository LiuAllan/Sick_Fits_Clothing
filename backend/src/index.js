//Startups Node server
require('dotenv').config({ path: 'variables.env'});
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');
const jwt = require('jsonwebtoken');

const server = createServer();

//TODO use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

//TODO use express middleware to populate current user
// Decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
	// console.log("I am a middleware");
	const {token} = req.cookies;
	if(token)
	{
		const {userId} = jwt.verify(token, process.env.APP_SECRET);
		// put the userId onto the req for future request to access
		req.userId = userId;
	}
	next();
});

// Create a middleware that populates the user on each request
server.express.use(async(req, res, next) => {
	// if they arent logged in, skip this
	if(!req.userId) return next();
	const user = await db.query.user(
		{where: {id:  req.userId}},
		'{id, permissions, email, name}'
		);
	req.user = user;
	next();
});

server.start(
{
	cors: {
		credentials: true,
		origin: process.env.FRONTEND_URL, 
	},
}, 
	deets => {
		console.log(`Backend Server is running on port http:/localhost:${deets.port}`);
	}
);