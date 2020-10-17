const { examHandler } = require('../handlers');

const exam = {
	saveExamDetails: async (req, res) => {
		let data = req.body;
		let userId = req.user._id;
		examHandler.saveExamDetails(data, userId).then((response) => {
			delete response.password;
			delete response.createdAt;
			res.status(200).send(response);
		});
	},
	getExamDetails: async (req, res) => {
		let userId = req.user._id;
		let pageIndex = req.query.pageIndex;
		let totalExams = await examHandler.getExamsLength(userId);
		let pageCount = Math.ceil(totalExams / 5);
		examHandler.getAllExams(userId, pageIndex).then((response) => {
			res.status(200).send({ exams: response, pageCount: pageCount });
		});
	},
	updateExamDetails: async (req, res) => {
		let userId = req.user._id;
		let examDetails = req.body;
		let examId = req.params.examId;
		let updatedExam = await examHandler.updateExam(
			userId,
			examId,
			examDetails
		);
		res.status(updatedExam.status).send(updatedExam.data);
	},
	deleteExam: async (req, res) => {
		let userId = req.user._id;
		let examId = req.query.examId;
		let deletedExam = await examHandler.deleteExam(userId, examId);
		res.status(200).send(deletedExam);
	},

	getParticularExam: async (req, res) => {
		let examId = req.params.examId;
		let exam = await examHandler.getParticularExam(examId);
		res.status(200).send(exam);
	},
};

module.exports = exam;
