'use strict';
global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {Users} = require('../users/user-schema');
const {TEST_DATABASE} = require( '../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', function() {
	const username = 'exampleUser';
	const password = 'examplePass';
	const usernameB = 'exampleUserB';
	const passwordB = 'examplePassB';

	// before(function() {
	// 	return runServer(TEST_DATABASE);
	// });

	after(function() {
		return closeServer();
	});

	beforeEach(function() {});

	afterEach(function() {
		return Users.remove({});
	});

	describe('/login', function() {
		describe('POST', function() {
			it('Should reject users with missing username', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						password,
					})
					.then(res => {
            expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
          })
      });
			it('Should reject users with missing password', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('password');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with non-string username', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username: 1234,
						password,
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string');
						expect(res.body.location).to.equal('username');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with non-string password', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
						password: 1234,
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string');
						expect(res.body.location).to.equal('password');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with non-trimmed username', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username: ` ${username} `,
						password,
					})
					.then(res => { 
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace');
						expect(res.body.location).to.equal('username');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with non-trimmed password', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
						password: ` ${password} `,
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace');
						expect(res.body.location).to.equal('password');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with empty username', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username: '',
						password,
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 1 characters long');
						expect(res.body.location).to.equal('username');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with password less than eight characters', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
						password: '123456',
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 10 characters long');
						expect(res.body.location).to.equal('password');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should reject users with password greater than 72 characters', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
						password: new Array(73).fill('a').join(''),
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at most 72 characters long');
						expect(res.body.location).to.equal('password');
          })
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			});
			it('Should create a new user', function() {
				return chai
					.request(app)
					.post('/login')
					.send({
						username,
						password,
					})
					.then(res => {
						expect(res).to.have.status(201);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.keys(
              '__v',
              '_id',
              'username',
              'password'
						);
						expect(res.body.username).to.equal(username);
						return Users.findOne({
							username
						});
					})
					.then(user => {
						expect(user).to.not.be.null;
						expect(user.username).to.equal(username);
						return user.validatePassword(password);
					})
					.then(passwordIsCorrect => {
						expect(passwordIsCorrect).to.be.true;
					});
			});
			
		});

		describe('GET', function() {
			it('Should return an empty array initially', function() {
				return chai.request(app).get('/login').then(res => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					expect(res.body).to.have.length(0);
				});
			});
			it('Should return an array of users', function() {
				return Users.create(
					{
						username,
						password,
					},
					{
						username: usernameB,
						password: passwordB,
					}
				)
					.then(() => chai.request(app).get('/login'))
					.then(res => {
						expect(res).to.have.status(200);
						expect(res.body).to.be.an('array');
						expect(res.body).to.have.length(2);
					});
			});
		});
	});
});
