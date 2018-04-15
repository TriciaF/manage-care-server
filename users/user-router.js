'use strict';

const express = require('express');
const userRouter = express.Router();
const { users } = require('./user-model');
const bodyParser = require('body-parser');
const { Users } = require('./user-schema');
userRouter.use(bodyParser.json());


/* ========== POST/CREATE ITEM ========== */
userRouter.post('/login', (req, res) => {
	console.log('Enter userRouter /login');
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['username', 'password'];
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
	);

	if (nonStringField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringField
		});
	}

	// If the username and password aren't trimmed we give an error.  Users might
	// expect that these will work without trimming (i.e. they want the password
	// "foobar ", including the space at the end).  We need to reject such values
	// explicitly so the users know what's happening, rather than silently
	// trimming them and expecting the user to understand.
	// We'll silently trim the other fields, because they aren't credentials used
	// to log in, so it's less of a problem.
	const explicityTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicityTrimmedFields.find(
		field => req.body[field].trim() !== req.body[field]
	);

	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end with whitespace',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 8,
			// bcrypt truncates after 72 characters, so let's not give the illusion
			// of security by storing extra (unused) info
			max: 72
		}
	};
	const tooSmallField = Object.keys(sizedFields).find(
		field =>
			'min' in sizedFields[field] &&
        req.body[field].trim().length < sizedFields[field].min
	);
	const tooLargeField = Object.keys(sizedFields).find(
		field =>
			'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
	);

	if (tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField ?
				`Must be at least ${sizedFields[tooSmallField]
					.min} characters long` : `Must be at most ${sizedFields[tooLargeField]
					.max} characters long`,
			location: tooSmallField || tooLargeField
		});
	}

	// Username and password come in pre-trimmed, otherwise we throw an error
	// before this
  let { username, password } = req.body;
  
  return users.create(username, password)
  .then(user => {
		console.log('user.create: ', username);
		return res.status(201).json(user).end();
	})
  .catch(err => {
    console.log(err);
    // Forward validation errors on to the client, otherwise give a 500
    // error because something unexpected has happened
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }); 
});


/* ========== GET/READ ALL ITEMS ========== */
userRouter.get('/login', (req, res) => {
	console.log('enter GET end point');
	users.get()
		.then(response => {
			res.json(response.map(item => item.serialize()));
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong' });
		});
});

userRouter.delete('/login/:id', (req, res) => {
	console.log('enter Delete end point');
	users.delete(req.params.id)
		.then(response => res.status(204).json(response))
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong' });
		});
});


module.exports = userRouter;