const initialState = {
	examinerInput: false,
	courses: [],
	examCode: '',
	questions: [],
};

const examinerReducers = (state = initialState, action) => {
	if (action.type === 'set_examiner_input_window') {
		return {
			...state,
			examinerInput: action.status,
		};
	} else if (action.type === 'set_courses') {
		return {
			...state,
			courses: action.courses,
		};
	} else if (action.type === 'set_questions') {
		return {
			...state,
			questions: action.questions,
			examCode: action.examCode,
		};
	} else if (action.type === 'add_question') {
		return {
			...state,
			questions: [...state.questions, action.question],
		};
	}
	return state;
};

export default examinerReducers;
