'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const authRouter = express.Router();

const createAuthToken = function(user) {
	return jwt.sign({ user }, JWT_SECRET, {
		subject: user.username,
		expiresIn: JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

const localAuth = passport.authenticate('local', { session: false });
authRouter.use(bodyParser.json());
// The user provides a username and password to login
authRouter.post('/login', localAuth, (req, res) => {
  console.log("Enter authRouter /login")
	const authToken = createAuthToken(req.user.serialize());
	return res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', { session: false });
// The user exchanges a valid JWT for a new one with a later expiration
authRouter.post('/refresh', jwtAuth, (req, res) => {
	console.log('POST: /refresh token - server');
	const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = authRouter;