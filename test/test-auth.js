'use strict';
global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { Users } = require('../users/user-schema.js');
const { JWT_SECRET, TEST_DATABASE } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', function () {
	const username = 'exampleUser';
	const password = 'examplePass';

	before(function () {
    return runServer(TEST_DATABASE);
    
	});

	// after(function () {
	// 	return closeServer(TEST_DATABASE);
	// });

	beforeEach(function() {
		return Users.hashPassword(password).then(password =>
			Users.create({
				username,
				password,
			})
		);
	});

	afterEach(function () {
		return Users.remove({});
	});

	describe('/auth/login', function () {
		it('Should reject requests with no credentials', function () {
			return chai
				.request(app)
				.post('/auth/login')
				.then(res => {
					expect(res).to.have.status(400);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should reject requests with incorrect usernames', function () {
			return chai
				.request(app)
				.post('/auth/login')
				.send({ username: 'wrongUsername', password })        
				.then(res => {
					expect(res).to.have.status(401);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should reject requests with incorrect passwords', function () {
			return chai
				.request(app)
				.post('/auth/login')
				.send({ username, password: 'wrongPassword' })
				.then(res => {
					expect(res).to.have.status(401);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should return a valid auth token', function () {
			return chai
				.request(app)
				.post('/auth/login')
				.send({ username, password })
				.then(res => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					const token = res.body.authToken;
					console.log('authToken = ', token);
					expect(token).to.be.a('string');
					const payload = jwt.verify(token, JWT_SECRET, {
						algorithm: ['HS256']
					});
					});
				});
		});
	describe('/auth/refresh', function () {
		it('Should reject requests with no credentials', function () {
			return chai
				.request(app)
				.post('/auth/refresh')
				.then(res => {
					expect(res).to.have.status(401);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should reject requests with an invalid token', function () {
			const token = jwt.sign(
				{
					username,
          password
        },
				'wrongSecret',
				{
					algorithm: 'HS256',
					expiresIn: '7d'
				}
			);

			return chai
				.request(app)
				.post('/auth/refresh')
				.set('Authorization', `Bearer ${token}`)
				.then(res => {
					expect(res).to.have.status(401);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should reject requests with an expired token', function () {
			const token = jwt.sign(
				{
					users: {
            username,
            password
					},
					exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
				},
				JWT_SECRET,
				{
					algorithm: 'HS256',
					subject: username
				}
			);

			return chai
				.request(app)
				.post('/auth/refresh')
				.set('authorization', `Bearer ${token}`)
				.then(res => {
					expect(res).to.have.status(401);
        })
				.catch(err => {
					if (err instanceof chai.AssertionError) {
						throw err;
					}
				});
		});
		it('Should return a valid auth token with a newer expiry date', function () {
      let token;
      return chai
        .request(app)
        .post('/login')
        .send({
          username,
          password,
        })
        .then( res => {
          expect(res).to.have.status(201);
          token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWFkNGM2MDU2NjA3NGYxZTFjNGMwOTUxIiwidXNlcm5hbWUiOiJleGFtcGxlVXNlciIsInBhc3N3b3JkIjoiJDJhJDEwJHNQS2dpVlRUMjZvZmxwdThZZExxeC40dDAzdmJWMUZmOG0wWHZVTTFqUGN5dlRaV3hmSWtlIn0sImlhdCI6MTUyMzg5Mzc2NSwiZXhwIjoxNTI0NDk4NTY1LCJzdWIiOiJleGFtcGxlVXNlciJ9.gWwdsBYM3yXk-k2noiABMmTkHBc7jNqIdfEAch4DEJs';
          // res.body.authToken;
          console.log('token = ', token)
        })
        .catch( err => {
          if(err instanceof chai.AssertionError)
            throw err;
        })
			// const token = jwt.sign(
			// 	{
			// 		users: {
      //       username,
      //       password
			// 		}
			// 	},
			// 	JWT_SECRET,
			// 	{
			// 		algorithm: 'HS256',
			// 		subject: username,
			// 		expiresIn: '7d'
			// 	}
			// );
      // const decoded = jwt.decode(token);
      .then(() => {   
        const decoded = jwt.decode(token);
			 return chai
				.request(app)
				.post('/auth/refresh')
				.set('authorization', `Bearer ${token}`)
				.then(res => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					const token = res.body.authToken;
					expect(token).to.be.a('string');
					const payload = jwt.verify(token, JWT_SECRET, {
						algorithm: ['HS256']
					});
					expect(payload.exp).to.be.at.least(decoded.exp);
        });
      })
		});
  });
})
