'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Carpool = mongoose.model('Carpool'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, carpool;

/**
 * Carpool routes tests
 */
describe('Carpool CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Carpool
		user.save(function() {
			carpool = {
				name: 'Carpool Name'
			};

			done();
		});
	});

	it('should be able to save Carpool instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carpool
				agent.post('/carpools')
					.send(carpool)
					.expect(200)
					.end(function(carpoolSaveErr, carpoolSaveRes) {
						// Handle Carpool save error
						if (carpoolSaveErr) done(carpoolSaveErr);

						// Get a list of Carpools
						agent.get('/carpools')
							.end(function(carpoolsGetErr, carpoolsGetRes) {
								// Handle Carpool save error
								if (carpoolsGetErr) done(carpoolsGetErr);

								// Get Carpools list
								var carpools = carpoolsGetRes.body;

								// Set assertions
								(carpools[0].user._id).should.equal(userId);
								(carpools[0].name).should.match('Carpool Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Carpool instance if not logged in', function(done) {
		agent.post('/carpools')
			.send(carpool)
			.expect(401)
			.end(function(carpoolSaveErr, carpoolSaveRes) {
				// Call the assertion callback
				done(carpoolSaveErr);
			});
	});

	it('should not be able to save Carpool instance if no name is provided', function(done) {
		// Invalidate name field
		carpool.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carpool
				agent.post('/carpools')
					.send(carpool)
					.expect(400)
					.end(function(carpoolSaveErr, carpoolSaveRes) {
						// Set message assertion
						(carpoolSaveRes.body.message).should.match('Please fill Carpool name');
						
						// Handle Carpool save error
						done(carpoolSaveErr);
					});
			});
	});

	it('should be able to update Carpool instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carpool
				agent.post('/carpools')
					.send(carpool)
					.expect(200)
					.end(function(carpoolSaveErr, carpoolSaveRes) {
						// Handle Carpool save error
						if (carpoolSaveErr) done(carpoolSaveErr);

						// Update Carpool name
						carpool.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Carpool
						agent.put('/carpools/' + carpoolSaveRes.body._id)
							.send(carpool)
							.expect(200)
							.end(function(carpoolUpdateErr, carpoolUpdateRes) {
								// Handle Carpool update error
								if (carpoolUpdateErr) done(carpoolUpdateErr);

								// Set assertions
								(carpoolUpdateRes.body._id).should.equal(carpoolSaveRes.body._id);
								(carpoolUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Carpools if not signed in', function(done) {
		// Create new Carpool model instance
		var carpoolObj = new Carpool(carpool);

		// Save the Carpool
		carpoolObj.save(function() {
			// Request Carpools
			request(app).get('/carpools')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Carpool if not signed in', function(done) {
		// Create new Carpool model instance
		var carpoolObj = new Carpool(carpool);

		// Save the Carpool
		carpoolObj.save(function() {
			request(app).get('/carpools/' + carpoolObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', carpool.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Carpool instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Carpool
				agent.post('/carpools')
					.send(carpool)
					.expect(200)
					.end(function(carpoolSaveErr, carpoolSaveRes) {
						// Handle Carpool save error
						if (carpoolSaveErr) done(carpoolSaveErr);

						// Delete existing Carpool
						agent.delete('/carpools/' + carpoolSaveRes.body._id)
							.send(carpool)
							.expect(200)
							.end(function(carpoolDeleteErr, carpoolDeleteRes) {
								// Handle Carpool error error
								if (carpoolDeleteErr) done(carpoolDeleteErr);

								// Set assertions
								(carpoolDeleteRes.body._id).should.equal(carpoolSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Carpool instance if not signed in', function(done) {
		// Set Carpool user 
		carpool.user = user;

		// Create new Carpool model instance
		var carpoolObj = new Carpool(carpool);

		// Save the Carpool
		carpoolObj.save(function() {
			// Try deleting Carpool
			request(app).delete('/carpools/' + carpoolObj._id)
			.expect(401)
			.end(function(carpoolDeleteErr, carpoolDeleteRes) {
				// Set message assertion
				(carpoolDeleteRes.body.message).should.match('User is not logged in');

				// Handle Carpool error error
				done(carpoolDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Carpool.remove().exec();
		done();
	});
});