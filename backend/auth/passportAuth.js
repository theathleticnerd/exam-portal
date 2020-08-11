const { users } = require('../models');
const userSchema = require('../schemas').users;
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy((email, password, done) => {
			users
				.find(email)
				.select({ email: 1, accountType: 1, accountStatus: 1, password: 1 })
				.then((user) => {
					if (user) {
						let userStatus = bcryptjs.compareSync(
							password,
							user.password
						);
						if (userStatus) return done(null, user);
						else
							return done(null, false, {
								message: 'Incorrect credentials',
							});
					} else {
						return done(null, false, {
							message: 'Incorrect credentials',
						});
					}
				});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		userSchema.findById(id, (err, user) => {
			done(err, user);
		});
	});
};