const express = require('express');
const {
	userController,
	adminController,
	examinerController,
} = require('../controllers');
const passport = require('passport');

module.exports = () => {
	const router = express.Router();

	router.post('/signup', userController.saveUserDetails);

	router.post('/login', userController.loginUser);

	router.get('/admin/examiner', adminController.getExaminerDetails);

	router.patch('/admin/examiner', adminController.saveExaminerDetails);

	router.patch(
		'/examiner',
		passport.authenticate('jwt'),
		examinerController.updateExaminerDetails
	);

	router.post(
		'/examiner/course',
		passport.authenticate('jwt'),
		examinerController.createCourse
	);

	router.get(
		'/examiner/course',
		passport.authenticate('jwt'),
		examinerController.getExaminerCourses
	);

	return router;
};
