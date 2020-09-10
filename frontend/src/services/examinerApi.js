import axios from 'axios';
import UserService from './userApi';

class ExaminerService {
	constructor() {
		this.userService = new UserService();
		this.EXAMINER_URL = 'api/examiner';
	}

	saveExaminerDetails = (state) => {
		let token = this.userService.getToken();
		return axios({
			method: 'patch',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}`,
			data: {
				institution: state.collegeName.value,
				department: state.department.value,
				designation: state.designation.value,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	saveExamDetails = (examDetails, examTimeDetails) => {
		let token = this.userService.getToken();
		return axios({
			method: 'post',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/exam`,
			data: {
				subject: examDetails.subject,
				course: examDetails.course,
				examCode: examDetails.examCode,
				password: examDetails.password,
				totalMarks: examTimeDetails.totalMarks,
				passingMarks: examTimeDetails.passingMarks,
				examDate: examTimeDetails.examDate,
				startTime: examTimeDetails.startTime,
				endTime: examTimeDetails.endTime,
				duration: examTimeDetails.duration,
				hideDuration: examTimeDetails.hideDuration,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	getAllExams = () => {
		let token = this.userService.getToken();
		return axios({
			method: 'get',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/exam`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	getParticularExam = (examId) => {
		let token = this.userService.getToken();
		return axios({
			method: 'get',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/exam/${examId}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	updateExam = (examId, data) => {
		let token = this.userService.getToken();
		return axios({
			method: 'patch',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/exam/${examId}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			data: data,
		});
	};

	deleteExam = (examId) => {
		let token = this.userService.getToken();
		return axios({
			method: 'delete',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/exam`,
			params: { examId },
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};
}

export default ExaminerService;
