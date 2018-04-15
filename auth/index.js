'use strict';
const { authRouter } = require('./auth-router');
const { localStrategy, jwtStrategy } = require('./strategies');

module.exports = { authRouter, localStrategy, jwtStrategy };