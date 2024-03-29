let { exam } = require('../models');
let { factories } = require('../factories');

let setErrorMessages = (key) => {
	if (key === 'examCode') {
		return 'Exam code already existed';
	} else if (key === 'subject') {
		return 'Subject already existed';
	} else if (key === 'passingMarks') {
		return 'Passing marks cannot be greater than total marks';
	}
};

let updatePassingMarks = async (key, examId, examDetails) => {
	let existingExam = await exam.getById(examId);

	if (existingExam.totalMarks < examDetails.passingMarks) {
		return { status: 400, data: { msg: setErrorMessages(key) } };
	} else {
		updatedExam = await exam.update(examId, examDetails).select({ [key]: 1 });
		return { status: 200, data: updatedExam };
	}
};

let updateExamPassword = async (examId, examDetails) => {
	let existingExam = await exam.getByExamId(examId).select({ password: 1 });
	let passwordStatus = factories.compareHashedPassword(
		examDetails.password.current,
		existingExam.password
	);
	if (passwordStatus) {
		let hashedPassword = factories.generateHashedPassword(
			examDetails.password.new
		);
		await exam.update(examId, { password: hashedPassword }).select({ _id: 1 });
		return {
			status: 200,
			data: { msg: 'Password changed successfully' },
		};
	} else return { status: 400, data: { msg: 'Incorrect current password' } };
};

let updateExamCodeAndSubject = async (key, examId, examDetails) => {
	let existingExam = await exam.get(examDetails);
	if (existingExam.length === 0) {
		updatedExam = await exam.update(examId, examDetails).select({ [key]: 1 });
		return { status: 200, data: updatedExam };
	} else {
		return { status: 409, data: { msg: setErrorMessages(key) } };
	}
};

const exams = {
	saveExamDetails: async (examDetails, userId) => {
		let examObject = factories.createExamObject(examDetails, userId);
		return exam.create(examObject);
	},

	getAllExams: async (userId, pageIndex, sortedBy) => {
		let pageSize = 5;
		pageIndex = pageIndex * pageSize;
		let allExams = await exam
			.get({ examinerId: userId })
			.select({ password: 0 })
			.sort({ [sortedBy]: -1 })
			.skip(pageIndex)
			.limit(pageSize);
		return allExams;
	},

	getExamsLength: async (userId) => {
		let totalExams = await exam.get({ examinerId: userId });
		return totalExams.length;
	},

	getParticularExam: async (examId) => {
		let examDetails = await exam.getById(examId);
		return examDetails[0];
	},

	updateExam: async (userId, examId, examDetails) => {
		let key = Object.keys(examDetails)[0];
		examDetails['examinerId'] = userId;
		let updatedExam;
		if (key === 'examCode' || key === 'subject') {
			let response = updateExamCodeAndSubject(key, examId, examDetails);
			return response;
		} else if (key === 'passingMarks') {
			let response = await updatePassingMarks(key, examId, examDetails);
			return response;
		} else if (key === 'startTime' || key === 'endTime') {
			updatedExam = await exam.update(examId, examDetails).select({ [key]: 1 });
			return { status: 200, data: updatedExam };
		} else if (key === 'password') {
			let response = await updateExamPassword(examId, examDetails);
			return response;
		} else if (key === 'courses') {
			updatedExam = await exam.update(examId, {
				course: examDetails.courses.id,
			});
			return { status: 200, data: updatedExam };
		} else if (key === 'duration' && examDetails.duration === '') {
			await exam.deleteDurationById(examId);
			return { status: 200, data: { msg: 'Deleted duration' } };
		} else {
			updatedExam = await exam.update(examId, examDetails).select({ [key]: 1 });
			return { status: 200, data: updatedExam };
		}
	},

	deleteExam: async (userId, examId) => {
		let deletedExam = await exam.deleteById(examId);
		return deletedExam;
	},

	validateExamKey: async (examId, examKey) => {
		let examDetails = await exam.getByExamId(examId).select({
			course: 0,
			examCode: 0,
			examinerId: 0,
			examDate: 0,
			createdAt: 0,
		});
		let validatedPassword = factories.compareHashedPassword(
			examKey,
			examDetails.password
		);
		if (validatedPassword) {
			delete examDetails['password'];
			return { status: 200, examDetails };
		} else {
			return { status: 401, msg: 'Incorrect exam key' };
		}
	},
};

module.exports = exams;
