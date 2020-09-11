import React from 'react';

import styles from './question.module.css';
import validateInputs from '../../../../services/validation';

class Questions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			question: { value: '', error: '' },
			optionsType: { value: '', error: '' },
			options: { value: [], error: '' },
			correctAnswer: { show: false },
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleOptionTypeChange = this.handleOptionTypeChange.bind(this);
		this.showOptionInputs = this.showOptionInputs.bind(this);
		this.createQuestion = this.createQuestion.bind(this);
	}

	handleChange(event) {
		let key = event.target.name;
		let value = event.target.value;
		let regex = /\d/g;
		if (regex.test(key)) {
			let optionNo = parseInt(key[key.length - 1], 10);
			let totalOptions = this.state.options.value;
			totalOptions[optionNo - 1][key].value = value;
			key = 'options';
			value = totalOptions;
		} else if (key === 'options') {
			let arr = [];
			let size = parseInt(value, 10);
			for (let i = 0; i < size; i++) {
				let innerKey = `option${i + 1}`;
				arr[i] = { [innerKey]: { value: '', error: '' } };
			}
			value = arr;
		}
		this.setState((prevState) => ({
			[key]: {
				...prevState[key],
				value: value,
			},
		}));
	}

	handleOptionTypeChange(event) {
		let key = event.target.name;
		let show = true;
		let value = event.target.value;
		if (value === 'none') {
			show = false;
		}
		this.setState((prevState) => ({
			correctAnswer: {
				show: show,
			},
			[key]: {
				...prevState[key],
				value: value,
			},
		}));
	}

	showOptionInputs() {
		return this.state.options.map((option, index) => {
			return (
				<div className='form-group'>
					<label>Option {index + 1}</label>
					<input
						type='text'
						className='form-control'
						name={`option ${index + 1}`}
					/>
				</div>
			);
		});
	}

	createQuestion(event) {
		event.preventDefault();
		let validationState = validateInputs.createQuestionFields(this.state);
		if (validationState.error) {
			console.log(validationState.tempState);
			this.setState(validationState.tempState);
		}
	}

	render() {
		return (
			<div className='container'>
				<div
					className={`card ${styles.w60} mx-auto ${styles.questionCard}`}
				>
					<div
						className={`card-header text-center ${styles.questionHeader}`}
					>
						Add questions
					</div>
					<form onSubmit={this.createQuestion}>
						<div className='card-body'>
							<div className='container'>
								<div className='form-group'>
									<label>
										Question{' '}
										{this.state.question.error ? (
											<span className='text-danger'>
												{this.state.question.error}
											</span>
										) : null}
									</label>
									<textarea
										className={`form-control ${styles.textArea}`}
										value={this.state.question.value}
										rows='2'
										name='question'
										onChange={this.handleChange}
									></textarea>
								</div>
								<div className='form-group'>
									<label>
										Option type{' '}
										{this.state.optionsType.error ? (
											<span className='text-danger'>
												{this.state.optionsType.error}
											</span>
										) : null}
									</label>
									<select
										name='optionsType'
										onChange={this.handleOptionTypeChange}
										value={this.state.optionsType.value}
										className='form-control'
									>
										<option value='none'>Select option</option>
										<option value='single'>Single</option>
										<option value='multiple'>Multiple</option>
									</select>
								</div>
								<div className='form-group'>
									<label>
										Total Options
										{this.state.optionsType.error ? (
											<span className='text-danger'>
												{this.state.options.error}
											</span>
										) : null}
									</label>
									<select
										className='form-control'
										name='options'
										value={this.state.options.value.length}
										onChange={this.handleChange}
									>
										<option value='0'>Select number</option>
										<option value='1'>1</option>
										<option value='2'>2</option>
										<option value='3'>3</option>
										<option value='4'>4</option>
										<option value='5'>5</option>
										<option value='6'>6</option>
									</select>
								</div>
								{this.state.options.value.map((option, index) => {
									let key = Object.keys(option)[0];
									return (
										<div className='form-group' key={key}>
											<label>
												Option {index + 1}
												{option[key].error ? (
													<span className='text-danger'>
														{option[key].error}
													</span>
												) : null}
											</label>
											<input
												type='text'
												name={key}
												value={option.value}
												onChange={this.handleChange}
												className='form-control'
											/>
										</div>
									);
								})}
								{this.state.correctAnswer.show ? (
									this.state.optionsType.value === 'single' ? (
										<div className='form-group'>
											<label>Correct answer</label>
											<select
												className='form-control'
												name='options'
											>
												<option value='0'>Select number</option>
												<option value='1'>1</option>
											</select>
										</div>
									) : (
										<div className='form-group'>
											<label>Correct answer</label>
											<select
												multiple
												size='2'
												className='form-control'
												name='options'
											>
												<option value='0'>Select number</option>
												<option value='1'>1</option>
												<option value='1'>1</option>
											</select>
										</div>
									)
								) : null}
							</div>
						</div>
						<div className='card-footer'>
							<div className='d-flex justify-content-end'>
								<button type='submit' className='btn btn-primary'>
									Create
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Questions;
