'use strict';

const { Users } = require('./user-schema');
const bcrypt = require('bcryptjs');



const users = {
	create: function(username, password) {
		console.log('Enter create users: ', username, password);
		return Users.find({ username })
			.count()
			.then(count => {
				if (count !== 0) {
					// user already exits, decrypt password and login
					return Users.find({ username })
						.then(user => {
							user.map(item => {
								if (bcrypt.compareSync(password, item.password))
									return Promise.resolve();
							});
						});
				} else {
					// If there is no existing user, hash the password
          const hash = bcrypt.hashSync(password, 10);
          console.log("user not found - creating user")
					return Users.create({
						username: username,
						password: hash,
          });
				}
			});
	},

	get: function() {
		console.log('Enter Get users');
		return Users.find();
	},

	delete: function(id) {
		console.log('Enter Delete users');
		return Users.findByIdAndRemove(id);
	},
};


module.exports = { users };