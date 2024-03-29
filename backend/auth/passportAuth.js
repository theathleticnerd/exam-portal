const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { users, examiner } = require('../models');
const { factories } = require('../factories');

let comparePassword = (typedPassword, user, done) => {
	let userStatus = factories.compareHashedPassword(
		typedPassword,
		user.password
	);
	if (userStatus) return done(null, user);
	else
		return done(null, false, {
			message: 'Incorrect credentials',
		});
};

module.exports = (passport) => {
	passport.use(
		new LocalStrategy((email, password, done) => {
			users
				.find({ email: email })
				.select({
					email: 1,
					accountType: 1,
					password: 1,
					lastLogin: 1,
					firstName: 1,
					lastName: 1,
				})
				.then((user) => {
					if (user) {
						examiner
							.find({ userId: user._id })
							.select({ accountStatus: 1 })
							.then((userData) => {
								if (user.accountType === 'examiner') {
									if (userData.accountStatus === 'pending') {
										return done(null, false, {
											message: 'Account not approved',
										});
									} else if (userData.accountStatus === 'declined') {
										return done(null, false, {
											message: 'Account has been closed',
										});
									} else {
										return comparePassword(password, user, done);
									}
								} else if (
									user.accountType === 'admin' ||
									user.accountType === 'student'
								) {
									return comparePassword(password, user, done);
								}
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
		users.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(
					'Authorization'
				),
				secretOrKey: 'gRG9lIiwiaWF0IjoxNTE2MjM5',
			},
			function (jwtPayload, cb) {
				return users
					.findById(jwtPayload.userId)
					.select({ username: 1 })
					.then((user) => {
						return cb(null, user);
					})
					.catch((err) => {
						return cb(err);
					});
			}
		)
	);
};
