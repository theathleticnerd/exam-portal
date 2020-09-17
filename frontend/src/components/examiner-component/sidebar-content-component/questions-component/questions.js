import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import QuestionService from '../../../../services/questionApi';
import AddQuestions from './addQuestions';
import styles from './question.module.css';
import * as ActionTypes from '../../../../action';

class Questions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			deleteIndex: '',
		};
		this.questionService = new QuestionService();
		this.ShowDeleteDialog = this.ShowDeleteDialog.bind(this);
		this.deleteQuestion = this.deleteQuestion.bind(this);
	}

	componentDidMount() {
		let examId = this.props.match.params.examId;

		this.questionService.getAll(examId).then((response) => {
			let data = response.data;
			this.props.setQuestions(data.questionData, data.examData.examCode);
		});
	}

	editQuestion(questionId) {
		let examId = this.props.match.params.examId;
		this.props.history.push({
			pathname: `/examiner/exam/${examId}/question/${questionId}`,
		});
	}

	handleDeleteDialog(status, id) {
		this.setState({ showDialog: status, deleteIndex: id });
	}

	ShowDeleteDialog() {
		return (
			<Modal
				show={this.state.showDialog}
				onHide={() => this.handleDeleteDialog(false, '')}
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>Caution</Modal.Header>
				<Modal.Body>Do you want to delete this question ?</Modal.Body>
				<Modal.Footer>
					<Button
						variant='secondary'
						onClick={() => this.handleDeleteDialog(false, '')}
					>
						Close
					</Button>
					<Button variant='primary' onClick={this.deleteQuestion}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	deleteQuestion() {
		let questionId = this.state.deleteIndex;
		this.questionService.delete(questionId).then((response) => {
			let questions = this.props.questions.filter(
				(item) => item._id !== response.data._id
			);
			this.props.setQuestions(questions, this.props.examCode);
			this.handleDeleteDialog(false, '');
		});
	}

	render() {
		let questionList = this.props.questions.map((data, index) => {
			return (
				<div key={data._id} className='d-flex justify-content-between'>
					<div
						className='my-2 cursor-pointer'
						onClick={() => this.editQuestion(data._id)}
					>
						{index + 1}) {data.question}
					</div>
					<div
						className='align-self-center cursor-pointer'
						onClick={() => this.handleDeleteDialog(true, data._id)}
					>
						<i className='fa fa-trash'></i>
					</div>
				</div>
			);
		});
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-7'>
						<AddQuestions {...this.props} />;
					</div>
					<div className='col-md-5'>
						<div className={`card ${styles.examDetailsCard}`}>
							<div
								className={`card-header ${styles.examDetailHeader} text-center bg-dark text-white`}
							>
								Exam details
							</div>
							<div className='card-body'>
								<div className='d-flex justify-content-between'>
									<p>Exam code</p>
									<p>{this.props.examCode}</p>
								</div>
								<div className='d-flex justify-content-between'>
									<p>Total Questions</p>
									<p>{this.props.questions.length}</p>
								</div>
								<p className='mb-1'>Questions</p>
								<div className=''>
									{this.props.questions.length !== 0 ? (
										questionList
									) : (
										<div className='text-center'> No questions</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<this.ShowDeleteDialog />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		examCode: state.examinerReducer.examCode,
		questions: state.examinerReducer.questions,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setQuestions: (questions, examCode) => {
			dispatch({
				type: ActionTypes.SET_QUESTIONS,
				questions: questions,
				examCode: examCode,
			});
		},
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Questions)
);
