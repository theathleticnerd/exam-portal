let bcrypt = require('bcryptjs');

let { student, users, exam } = require('../models');

let hashPassword = (password) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(password, salt);
	return hash;
};

const students = {
	addNewStudent: async (studentData) => {
		let existingStudent;
		let existingUser = await users.findByEmailAndMobileNumber(studentData);
		studentData.password = hashPassword(studentData.password);
		if (existingUser) {
			existingStudent = await student.findByStudentId(
				existingUser.userDataId,
				studentData
			);
			if (existingStudent) {
				let msg = 'Student is already added in this exam';
				return { status: 400, msg: msg };
			} else {
				await student.updateExam(existingUser.userDataId, {
					examId: studentData.examCode,
				});
				let msg = 'New student added';
				return { status: 200, msg: msg };
			}
		} else {
			let userData = await users.create(studentData);
			studentData.userId = userData._id;
			let newStudent = await student.create(studentData);
			await users.update(userData._id, { userDataId: newStudent._id });
			await student.updateExam(newStudent._id, {
				examId: studentData.examCode,
			});
			let msg = 'New student added';
			return { status: 200, msg: msg };
		}
	},

	getAllStudents: async (examinerId, pageQuery) => {
		let pageIndex = parseInt(pageQuery.pageIndex, 10);
		let pageSize = parseInt(pageQuery.pageSize, 10);
		pageIndex = pageIndex * pageSize;
		let examData = await exam
			.findExamStudents(examinerId)
			.skip(pageIndex)
			.limit(pageSize);

		return examData;
	},

	getStudentsLength: async (examinerId) => {
		let studentData = await student.findByExaminerId(examinerId);
		return studentData.length;
	},

	delete: async (studentId) => {
		let data = await student.delete(studentId);
		await users.deleteByUserDataId(data.userId);
		return { status: 200, msg: 'Student deleted successfully' };
	},
};

module.exports = students;
