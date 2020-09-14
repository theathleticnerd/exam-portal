let { question } = require('../models');

let createQuestionData = (data, image) => {
	let options = JSON.parse(data.options);
	let optionArray = options.map((option) => {
		let key = Object.keys(option)[0];
		return { name: key, value: option[key].value };
	});
	return {
		examId: data.examId,
		question: data.question,
		optionType: data.optionType,
		options: optionArray,
		correctAnswer: data.correctAnswer,
		image: image ? image.filename : null,
	};
};

const questions = {
	addNewQuestion: async (questionData, image) => {
		let questionObject = createQuestionData(questionData, image);
		return question.create(questionObject);
	},
};

module.exports = questions;
