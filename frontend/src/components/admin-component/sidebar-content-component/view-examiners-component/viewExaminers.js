import React from 'react';
import { Pagination } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import AdminService from '../../../../services/adminApi';
import styles from './viewExaminers.module.css';
import ApproveDeclineModal from '../../../../modals/approveDeclineModal';
import factories from '../../../../factories/factories';

class ViewExaminer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			examinerCount: { approved: 0, pending: 0, declined: 0 },
			pageIndex: 0,
			pageSize: 5,
			examinerData: [],
			accountStatus: '',
			approveDeclineModal: { show: false, data: '' },
			snackBar: { show: false, msg: '' },
			page: 1,
			selectedCard: '',
		};
		this.adminService = new AdminService();
	}

	componentDidMount() {
		this.adminService
			.getAllExaminer({ type: 'examinerCount' })
			.then((res) => {
				this.setState({
					examinerCount: {
						approved: res.data.approved,
						pending: res.data.pending,
						declined: res.data.declined,
					},
				});
			});
	}

	handleModal = (status) => {
		this.setState({
			approveDeclineModal: {
				show: status,
				data: '',
			},
		});
	};

	handleSnackBar = (status, data) => {
		let examinerCount;
		if (status) {
			examinerCount = factories.updateExaminerCount(
				this.state.accountStatus,
				data.accountStatus,
				this.state.examinerCount
			);
		} else examinerCount = this.state.examinerCount;

		this.setState(
			{
				examinerCount: examinerCount,
				snackBar: {
					show: status,
					msg: data.msg,
				},
			},
			() => this.handleCardClick(this.state.selectedCard, 1)
		);
	};

	handleCardClick = (type, pageNo) => {
		let { pageIndex, pageSize } = this.state;
		this.adminService
			.getExaminersCount(type, pageIndex, pageSize)
			.then((res) => {
				this.setState({
					examinerData: res.data.examiner,
					accountStatus: type,
					pageCount: Math.ceil(
						this.state.examinerCount[type] / this.state.pageSize
					),
					page: pageNo,
					selectedCard: type,
				});
			});
	};

	handlePageChange = (event, value) => {
		this.setState({ pageIndex: value - 1 }, () =>
			this.handleCardClick(this.state.accountStatus, value)
		);
	};

	approveOrDeclineExaminers(firstName, lastName, modalType, id) {
		this.setState({
			approveDeclineModal: {
				show: true,
				data: {
					id: id,
					type: modalType,
					success: false,
					fullName: `${firstName} ${lastName}`,
				},
			},
		});
	}

	examinerData = () => {
		let { pageIndex, pageSize } = this.state;
		let examiners = this.state.examinerData.map((examiner, index) => (
			<tr key={examiner._id}>
				<th scope='row'>{pageIndex * pageSize + index + 1}</th>
				<td>{examiner.data.firstName}</td>
				<td>{examiner.data.lastName}</td>
				<td>{examiner.data.email}</td>
				<td>
					{this.state.accountStatus === 'pending' ||
					this.state.accountStatus === 'approved' ? (
						<button
							type='button'
							className={`${styles.icon} btn p-0`}
							data-toggle='tooltip'
							data-placement='top'
							title='Decline'
							onClick={() => {
								this.approveOrDeclineExaminers(
									examiner.data.firstName,
									examiner.data.lastName,
									'decline',
									examiner._id
								);
							}}
						>
							<i
								className={'fa fa-trash-o cursor-pointer text-white'}
							></i>
						</button>
					) : null}
					{this.state.accountStatus === 'pending' ||
					this.state.accountStatus === 'declined' ? (
						<button
							type='button'
							className={`${styles.icon} btn pr-2`}
							data-toggle='tooltip'
							data-placement='top'
							title='Approve'
							onClick={() => {
								this.approveOrDeclineExaminers(
									examiner.data.firstName,
									examiner.data.lastName,
									'approve',
									examiner._id
								);
							}}
						>
							<i className='fa fa-check-square-o cursor-pointer text-white'></i>
						</button>
					) : null}
				</td>
			</tr>
		));
		return (
			<div className='mt-4 table-responsive'>
				<table className='table table-hover table-dark mb-0'>
					<thead>
						<tr>
							<th scope='col'>S.No</th>
							<th scope='col'>First name</th>
							<th scope='col'>Last name</th>
							<th scope='col'>Email</th>
							<th scope='col'>Actions</th>
						</tr>
					</thead>
					<tbody>{examiners}</tbody>
				</table>
				<div className='d-flex justify-content-center bg-white py-2'>
					<Pagination
						count={this.state.pageCount}
						showFirstButton
						showLastButton
						onChange={this.handlePageChange}
						size='large'
						page={this.state.page}
					/>
				</div>
			</div>
		);
	};

	render() {
		return (
			<div className='container pt-4'>
				<div className='row'>
					<div className='col-md-4'>
						<div
							onClick={() => {
								this.setState({ pageIndex: 0 }, () =>
									this.handleCardClick('approved', 1)
								);
							}}
							className={`card p-3 ${
								styles.approvedCard
							} cursor-pointer ${styles.iconHover} ${
								this.state.selectedCard === 'approved'
									? styles.cardBorder
									: null
							}`}
						>
							<img
								alt='approved icon'
								src={require('../../../../assets/icons/approvedIcon.jpg')}
								width='65px'
								className='mx-auto'
							/>
							<h3 className='mb-0 text-center text-white font-weight-normal'>
								Approved
							</h3>
							<div className='d-flex justify-content-between mt-2'>
								<p
									className={`mb-0 font-weight-bold text-white ${styles.textStyle}`}
								>
									Total approved
								</p>
								<p className={`mb-0 text-white ${styles.textStyle}`}>
									{this.state.examinerCount.approved}
								</p>
							</div>
						</div>
					</div>
					<div className='col-md-4'>
						<div
							className={`card p-3 ${
								styles.pendingCard
							} cursor-pointer ${styles.iconHover} ${
								this.state.selectedCard === 'pending'
									? styles.cardBorder
									: null
							}`}
							onClick={() => {
								this.setState({ pageIndex: 0 }, () =>
									this.handleCardClick('pending', 1)
								);
							}}
						>
							<img
								alt='pending icon'
								src={require('../../../../assets/icons/pendingIcon.png')}
								width='65px'
								className='mx-auto'
							/>
							<h3 className='mb-0 text-center text-white font-weight-normal'>
								Pending
							</h3>
							<div className='d-flex justify-content-between mt-2'>
								<p
									className={`mb-0 font-weight-bold text-white ${styles.textStyle}`}
								>
									Total pending
								</p>
								<p className={`mb-0 text-white ${styles.textStyle}`}>
									{this.state.examinerCount.pending}
								</p>
							</div>
						</div>
					</div>
					<div className='col-md-4'>
						<div
							className={`card p-3 ${
								styles.declinedCard
							} cursor-pointer ${styles.iconHover} ${
								this.state.selectedCard === 'declined'
									? styles.cardBorder
									: null
							}`}
							onClick={() => {
								this.setState({ pageIndex: 0 }, () =>
									this.handleCardClick('declined', 1)
								);
							}}
						>
							<img
								alt='declined icon'
								src={require('../../../../assets/icons/declinedIcon.jpg')}
								width='65px'
								className='mx-auto'
							/>
							<h3 className='mb-0 text-center text-white font-weight-normal'>
								Declined
							</h3>
							<div className='d-flex justify-content-between mt-2'>
								<p
									className={`mb-0 font-weight-bold text-white ${styles.textStyle}`}
								>
									Total declined
								</p>
								<p className={`mb-0 text-white ${styles.textStyle}`}>
									{this.state.examinerCount.declined}
								</p>
							</div>
						</div>
					</div>
				</div>
				{this.state.examinerData.length !== 0 ? (
					<this.examinerData />
				) : (
					<h3 className='pt-4 font-weight-normal text-center'>
						{this.state.msg}
					</h3>
				)}
				<ApproveDeclineModal
					show={this.state.approveDeclineModal.show}
					closeModal={this.handleModal}
					modalData={this.state.approveDeclineModal.data}
					handleSnackBar={this.handleSnackBar}
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

export default ViewExaminer;
