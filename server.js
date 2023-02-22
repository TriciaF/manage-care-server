'use strict';

//initailizations
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongodb = require('mongodb');
// const client = new mongodb.MongoClient(DATABASE_URL, { useNewUrlParser: true, useUnitifedTopology: true });
const morgan = require('morgan');

const patientRouter = require('./patients/patient-router');
const userRouter = require('./users/user-router');
const authRouter = require('./auth/auth-router');

const { PORT, TEST_DATABASE, DATABASE_URL, CLIENT_ORIGIN } = require('./config');
const { localStrategy, jwtStrategy } = require('./auth/strategies');
const { ok } = require('cli');
const { resolve } = require('path');

const app = express();
app.use(morgan('common'));
app.use(cors({ origin: CLIENT_ORIGIN }));
// app.use(cors());

// ifor CORS
app.use(function(req, res, next) 
{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200)
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

//Send static files to client
app.use(express.static(path.join(__dirname, './client/public')));
//re-Route requests to our router
app.use('/', patientRouter);
app.use('/', userRouter);
app.use('/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/protected', jwtAuth, (req, res) => {
  res.json({
    data: 'authorized'
  });
});

//server functions
let server;

// function runServer(dbUrl) {
// 	console.log('run server started');
// 	return new Promise(( resolve, reject) => {
// 		mongodb.connect(dbUrl, err => {
// 			if (err) {
// 				return reject(err);
// 			}
// 			server = app.listen(PORT, () => {
// 				console.log(`Your app is listening on port ${PORT}`);
// 				resolve();
// 			})
// 				.on('error', err => {
// 					mongodb.disconnect();
// 					reject(err);
// 				});
// 		});
// 	});
// 	};


function runServer(dbUrl) {
	console.log('run server started');
	return new Promise((resolve, reject) => {
		mongoose.connect(dbUrl,  err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(PORT, () => {
				console.log(`Your app is listening on port ${PORT}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	console.log('close server start');
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	console.log("Enter Server Start, database = ", DATABASE_URL)
	runServer(DATABASE_URL).catch(err => console.error('Database did not start'));
}

module.exports = { app, runServer, closeServer };