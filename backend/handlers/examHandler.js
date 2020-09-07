let { exam } = require('../models');
const bcrypt = require('bcryptjs');
const moment = require('moment');

let createExamObject = (data, userId) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(data.password, salt);
	let object = {
		subject: data.subject,
		course: data.course,
		examCode: data.examCode,
		password: hash,
		totalMarks: parseInt(data.totalMarks, 10),
		passingMarks: parseInt(data.passingMarks, 10),
		examinerId: userId,
		startTime: new Date(`${data.examDate} ${data.startTime}`),
		endTime: new Date(`${data.examDate} ${data.endTime}`),
		examDate: new Date(data.examDate),
	};
	if (!data.hideDuration) {
		object.duration = data.duration;
	}
	return object;
};

let setErrorMessages = (key) => {
	if (key === 'examCode') {
		return 'Exam code already existed';
	} else if (key === 'subject') {
		return 'Subject already existed';
	} else if (key === 'passingMarks') {
		return 'Passing marks cannot be greater than total marks';
	}
};

const exams = {
	saveExamDetails: async (examDetails, userId) => {
		let examObject = createExamObject(examDetails, userId);
		return exam.create(examObject);
	},

	getAllExams: async (userId) => {
		let allExams = await exam
			.get({ examinerId: userId })
			.select({ password: 0, createdAt: 0 })
			.sort({ examDate: -1 });
		return allExams;
	},

	getParticularExam: async (examId) => {
		let examDetails = await exam
			.getById(examId)
			.select({ password: 0, createdAt: 0 });
		return examDetails;
	},

	updateExam: async (userId, examId, examDetails) => {
		let key = Object.keys(examDetails)[0];
		examDetails['examinerId'] = userId;
		let updatedExam;
		if (key === 'examCode' || key === 'subject') {
			let existingExam = await exam.get(examDetails);
			if (existingExam.length === 0) {
				updatedExam = await exam
					.update(examId, examDetails)
					.select({ [key]: 1 });
				return { status: 200, data: updatedExam };
			} else {
				return { status: 409, data: { msg: setErrorMessages(key) } };
			}
		} else if (key === 'passingMarks') {
			let existingExam = await exam
				.getById(examId)
				.select({ totalMarks: 1 });
			if (existingExam.totalMarks < examDetails.passingMarks) {
				return { status: 400, data: { msg: setErrorMessages(key) } };
			} else {
				updatedExam = await exam
					.update(examId, examDetails)
					.select({ [key]: 1 });

				return { status: 200, data: updatedExam };
			}
		} else {
			updatedExam = await exam
				.update(examId, examDetails)
				.select({ [key]: 1 });
			return { status: 200, data: updatedExam };
		}
		// console.log(examDetails);
		// examDetails.startTime = new Date(
		// 	`${moment(examDetails.examDate).format('YYYY-MM-DD')} ${
		// 		examDetails.startTime
		// 	}`
		// );
		// examDetails.endTime = new Date(
		// 	`${moment(examDetails.examDate).format('YYYY-MM-DD')} ${
		// 		examDetails.endTime
		// 	}`
		// );
		// let examCodeCheck = await checkExistingExamCode(
		// 	examDetails.examinerId,
		// 	examDetails.examCode
		// );
		// let updatedExam = await exam
		// 	.update(user, examDetails)
		// 	.select({ password: 0, createdAt: 0 });
		// return updatedExam;
	},

	deleteExam: async (userId, examId) => {
		let deletedExam = await exam.deleteById(examId);
		return deletedExam;
	},
};

module.exports = exams;
