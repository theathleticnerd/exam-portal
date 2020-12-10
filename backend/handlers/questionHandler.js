let { question, exam } = require('../models');

let createQuestionData = (data, image) => {
	let optionArray = [];
	for (let key in data) {
		if (!isNaN(key.slice(-1))) {
			optionArray.push({ name: key, value: data[key] });
		}
	}
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

	getSelectiveQuestionData: async (examId) => {
		let questionData = await question
			.getSpecificData(examId)
			.select({ _id: 1, question: 1 });
		let examData = await exam.getById(examId);
		let examCode = examData[0].examCode;
		return { questionData, examCode };
	},

	getAllQuestionData: async (examId) => {
		let questionData = await question
			.getSpecificData(examId)
			.select({ modifiedAt: 0, examId: 0 });
		return questionData;
	},

	getParticularQuestion: async (questionId) => {
		return question
			.findById(questionId)
			.select({ modifiedAt: 0, createdAt: 0, __v: 0, _id: 0 });
	},

	update: async (questionId, data, image) => {
		let questionObject = createQuestionData(data, image);
		return question
			.update(questionId, questionObject)
			.select({ examId: 1, question: 1 });
	},

	delete: async (questionId) => {
		return question.deleteById(questionId);
	},

	getQuestionImage: async (imageId) => {},
};

module.exports = questions;
