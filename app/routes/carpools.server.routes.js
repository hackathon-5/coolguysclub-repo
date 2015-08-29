'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var carpools = require('../../app/controllers/carpools.server.controller');

	// Carpools Routes
	app.route('/carpools')
		.get(carpools.list)
		.post(users.requiresLogin, carpools.create);

	app.route('/carpools/:carpoolId')
		.get(carpools.read)
		.put(users.requiresLogin, carpools.hasAuthorization, carpools.update)
		.delete(users.requiresLogin, carpools.hasAuthorization, carpools.delete);

	// Finish by binding the Carpool middleware
	app.param('carpoolId', carpools.carpoolByID);
};
