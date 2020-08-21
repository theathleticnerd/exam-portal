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

	createCourse = (state) => {
		let token = this.userService.getToken();
		return axios({
			method: 'post',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/course`,
			data: {
				name: state.name.value,
				description: state.description.value,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	editCourse = (id, state) => {
		let token = this.userService.getToken();
		return axios({
			method: 'patch',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/course`,
			params: {
				courseId: id,
				name: state.name.value,
				description: state.description.value,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};

	deleteCourse = (id) => {
		let token = this.userService.getToken();
		return axios({
			method: 'delete',
			url: `${process.env.REACT_APP_BASE_URL}/${this.EXAMINER_URL}/course`,
			params: {
				id: id,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	};
}

export default ExaminerService;
