import axios from 'axios';

import UserService from './userApi';

class QuestionService {
	constructor() {
		this.userService = new UserService();
		this.QUESTION_URL = 'api/examiner/question';
	}

	saveQuestion(formData) {
		let token = this.userService.getToken();
		return axios({
			method: 'post',
			url: `${process.env.REACT_APP_BASE_URL}/${this.QUESTION_URL}`,
			data: formData,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
	}
}

export default QuestionService;
