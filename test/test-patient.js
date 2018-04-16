'use strict';
global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { Users } = require('../users/user-schema');
const { TEST_DATABASE } = require ('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);


describe('/patient', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const lastName = 'User';
    const firstName = 'Example';
    const name = 'Sally Smith';
    const medication = 'Asprin';
    const dosage = '10 mg';
    const schedule = '1 time a day';
    const pharmacyName = 'CVS';
    const pharmacyAddr = '54 Titus Avenue, Rochester, NY 14617';
    const pharmacyPhone = '585-266-9700';
    const physicianName = 'Dr. William Smith';
    const physicianAddr = '220 Linden Oaks, Rochester, NY 14623';
    const physicianPhone = '585-544-8989';


    // before(function() {
    //     return runServer(TEST_DATABASE);
    // });

    // after(function() {
    //     return closeServer(TEST_DATABASE);
    // });

    beforeEach(function() {
        return Users.create({
            username,
            password,
        });
    });

    afterEach(function() {
        return Users.remove({});
    });

    describe('/patient', function() {
        describe('POST', function() {
            it('Should check for required fields in body', function() {
                return chai
                    .request(app)
                    .post('/api/risk')
                    .send({
                        name,
                        dosage,
                        schedule,
                        pharmacyName,
                        pharmacyAddr,
                        pharmacyPhone,
                        physicianName,
                        physicianAddr,
                        physicianPhone 
                    })
                    .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('medication'); 
                    })
                    .catch(err => {
                        if (err instanceof chai.AssertionError) {
                            throw err;
                        }
                    });
            });
            it('Should update and return the User object', function () {
            	return chai
            		.request(app)
            		.post('/patient')
            		.send({
                   name,
                   medication,
                   dosage,
                    schedule,
                    pharmacyName,
                    pharmacyAddr,
                    pharmacyPhone,
                    physicianName,
                    physicianAddr,
                    physicianPhone
            		})
            		.then( res => {
            			expect(res).to.have.status(201);
            			expect(res.body).to.be.an('object');
            			expect(res.body).to.have.keys(
                    'id',
            				'name',
            				'medication'
            			);
            		});
            });
        });
    });
});