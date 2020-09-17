import React from 'react';
import { Card, Collapse } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';

import styles from '../../exam.module.css';

const ExamMarks = ({
	state,
	handleExamChange,
	handleCollapseChange,
	updateExamDetails,
}) => {
	return (
		<Accordion defaultActiveKey='0'>
			<Card className='mb-2'>
				<Accordion.Toggle
					className={`bg-dark text-white ${styles.accordionHeading}`}
					as={Card.Header}
					variant='link'
					eventKey='0'
				>
					Exam marks
				</Accordion.Toggle>
				<Accordion.Collapse eventKey='0'>
					<Card.Body>
						<div className='container'>
							<div className='d-flex justify-content-between flex-row'>
								<div className='flex-column'>
									<label className={`mb-0 ${styles.editExamHeading}`}>
										Total marks
									</label>
									<p className={styles.editExamContent}>
										{state.totalMarks.prev}
									</p>
								</div>
								<p
									className='cursor-pointer edit-text align-self-center'
									onClick={() => handleCollapseChange('totalMarks')}
								>
									Edit
								</p>
							</div>
							<Collapse in={state.totalMarks.collapse}>
								<div className='row'>
									<div className='col-md-10'>
										<input
											type='text'
											name='totalMarks'
											maxLength={4}
											className='w-100 form-control mr-2'
											value={state.totalMarks.new}
											onChange={handleExamChange}
										/>
										{state.totalMarks.msg ? (
											<span>{state.totalMarks.msg}</span>
										) : null}
									</div>
									<div className='col-md-2'>
										<button
											type='button'
											className='btn btn-primary'
											onClick={
												state.totalMarks.new != null
													? () =>
															updateExamDetails({
																totalMarks:
																	state.totalMarks.new,
															})
													: null
											}
										>
											Update
										</button>
									</div>
								</div>
							</Collapse>
							<div className='d-flex justify-content-between flex-row mt-2'>
								<div className='flex-column'>
									<label className={`mb-0 ${styles.editExamHeading}`}>
										Passing marks
									</label>
									<p className={styles.editExamContent}>
										{state.passingMarks.prev}
									</p>
								</div>
								<p
									className='cursor-pointer edit-text align-self-center'
									onClick={() => handleCollapseChange('passingMarks')}
								>
									Edit
								</p>
							</div>
							<Collapse in={state.passingMarks.collapse}>
								<div className='row'>
									<div className='col-md-10'>
										<input
											type='text'
											name='passingMarks'
											maxLength={4}
											className='w-100 form-control mr-2'
											value={state.passingMarks.new}
											onChange={handleExamChange}
										/>
										{state.passingMarks.msg ? (
											<span>{state.passingMarks.msg}</span>
										) : null}
									</div>
									<div className='col-md-2'>
										<button
											type='button'
											className='btn btn-primary'
											onClick={
												state.passingMarks.new != null
													? () =>
															updateExamDetails({
																passingMarks:
																	state.passingMarks.new,
															})
													: null
											}
										>
											Update
										</button>
									</div>
								</div>
							</Collapse>
						</div>
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		</Accordion>
	);
};

export default ExamMarks;