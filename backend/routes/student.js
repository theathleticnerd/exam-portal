const express = require('express');
const passport = require('passport');

module.exports = () => {
	const router = express.Router();

	router.get('/exam');

	return router;
};
