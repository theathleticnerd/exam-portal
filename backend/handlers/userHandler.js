const { users } = require('../models');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { userModel } = require('../models/user');
const { createToken } = require('../auth').token;

mapNewUser = (userData) => {
	Object.keys(userData).forEach((key) => {
		if (key !== 'message' || key !== 'modal')
			userData[key] = userData[key]['value'];
	});
	return checkAccountStatus(userData);
};

checkAccountStatus = (data) => {
	if (data.accountType == 'examiner') {
		data.accountStatus = 'pending';
	} else {
		data.accountStatus = 'created';
	}
	return data;
};

const user = {
	saveUserDetails: async (req, res) => {
		let userData = mapNewUser(req.body);
		let existingUser = await users.find(userData.email);
		if (existingUser == null) {
			let salt = bcrypt.genSaltSync(10);
			let hash = bcrypt.hashSync(userData.password, salt);
			userData.password = hash;

			await users
				.create(userData)
				.then((user) => {
					if (user.accountType == 'examiner') {
						res.status(200).send({
							role: 'examiner',
							msg:
								'Your account would be created shortly.You will receive email soon.',
						});
					} else {
						res.status(200).send({
							role: 'student',
							msg: 'User created successfully',
						});
					}
				})
				.catch((err) => {
					let error = Object.values(err.errors)[0].message;
					res.status(400).send(error);
				});
		} else {
			res.status(200).send({ msg: 'User already existed' });
		}
	},

	loginUser: async (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return next(err);
			if (!user) return res.status(401).json({ msg: info.message });
			req.logIn(user, async (err) => {
				let token = createToken(user._id, user.accountType);
				return res.status(200).send({ token: token });
			});
		})(req, res, next);
	},
};

module.exports = user;