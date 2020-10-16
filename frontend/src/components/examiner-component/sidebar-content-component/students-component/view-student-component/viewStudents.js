import React from 'react';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	AccordionActions,
	Typography,
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemAvatar,
	Divider,
	Button,
	Switch,
	Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {
	ExpandMore,
	Person,
	Email,
	Call,
	Wc,
	House,
	Cake,
} from '@material-ui/icons';
import moment from 'moment';

import styles from '../students.module.css';
import ExaminerService from '../../../../../services/examinerApi';
import DeleteModal from '../../../../../modals/deleteModal';

class ViewStudents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			studentData: [],
			deleteModal: { show: false, id: '' },
			snackBar: { show: false, msg: '' },
		};
		this.examinerService = new ExaminerService();
	}

	viewStudents = () => {
		let examId = this.props.match.params.examId;
		this.examinerService
			.getParticularExamStudents(examId)
			.then((response) => {
				this.setState({ studentData: response.data });
			});
	};

	componentDidMount() {
		this.viewStudents();
	}

	handleSwitchChange = (event, studentId) => {
		let checked = event.target.checked;
		let examId = this.props.match.params.examId;

		this.examinerService.updateStudent(studentId, {
			accountStatus: checked === true ? 'enabled' : 'disabled',
			examId: examId,
		});
	};

	handleSnackBar = (show, msg) => {
		this.setState({
			snackBar: { show: show, msg: msg },
		});
	};

	hideDeleteModal = (show, id) => {
		this.setState({ deleteModal: { show: show, id: id } });
	};

	deleteExam = () => {
		let studentId = this.state.deleteModal.id;
		this.examinerService.deleteStudent(studentId).then((response) => {
			this.viewStudents();
			this.handleSnackBar(true, response.data.msg);
			this.hideDeleteModal(false, '');
		});
	};

	render() {
		let studentsData = this.state.studentData.map((value) => {
			let examId = this.props.match.params.examId;
			let checkedValue = value.exam.filter((data) => data.examId === examId);
			return (
				<Accordion key={value._id}>
					<AccordionSummary
						expandIcon={<ExpandMore className='text-white' />}
						id={`header-${value._id}`}
						aria-controls={`content-${value._id}`}
						className='bg-dark'
					>
						<Typography
							className={`${styles.accordionView} text-white`}
						>{`${value.studentId}`}</Typography>
						<Typography className='text-white'>{`${value.userData.firstName} ${value.userData.lastName}`}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className='container'>
							<div className='d-flex justify-content-end align-items-center'>
								<span>Disabled</span>
								<Switch
									checked={
										checkedValue[0].accountStatus === 'enabled'
											? true
											: false
									}
									name='accountStatus'
									color='primary'
									onChange={(event) =>
										this.handleSwitchChange(event, value._id)
									}
								/>
								<span>Enabled</span>
							</div>
							<div className='row'>
								<div className='col-md-6'>
									<List>
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Person />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Father name'
												secondary={value.fatherName}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Person />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Mother name'
												secondary={value.motherName}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Email />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Email'
												secondary={value.userData.email}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Cake />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Date of birth'
												secondary={moment(
													value.dob,
													'YYYY-MM-DD'
												).format('MMM Do, YYYY')}
											/>
										</ListItem>
									</List>
								</div>
								<div className='col-md-6'>
									<List>
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Call />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Mobile number'
												secondary={value.userData.mobileNumber}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<Wc />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Gender'
												secondary={value.gender}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
										<ListItem>
											<ListItemAvatar>
												<Avatar className='bg-dark'>
													<House />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary='Home address'
												secondary={value.address}
											/>
										</ListItem>
										<Divider variant='inset' component='li' />
									</List>
								</div>
							</div>
						</div>
					</AccordionDetails>
					<Divider />
					<AccordionActions className='bg-dark'>
						<Button size='small' variant='contained' color='primary'>
							Edit
						</Button>
						<Button
							size='small'
							variant='contained'
							color='secondary'
							onClick={() => this.hideDeleteModal(true, value.studentId)}
						>
							Delete
						</Button>
					</AccordionActions>
					<Divider />
				</Accordion>
			);
		});
		return (
			<div className='container w-75 mx-auto mt-4'>
				<p className={`mb-0 text-center ${styles.heading}`}>Students</p>
				{studentsData}
				<DeleteModal
					show={this.state.deleteModal.show}
					heading='student'
					hideModal={this.hideDeleteModal}
					deleteContent={this.deleteExam}
				/>
				<Snackbar
					open={this.state.snackBar.show}
					onClose={() => this.handleSnackBar(false, '')}
				>
					<MuiAlert
						elevation={6}
						variant='filled'
						onClose={() => this.handleSnackBar(false, '')}
						severity='success'
					>
						{this.state.snackBar.msg}
					</MuiAlert>
				</Snackbar>
			</div>
		);
	}
}

export default ViewStudents;