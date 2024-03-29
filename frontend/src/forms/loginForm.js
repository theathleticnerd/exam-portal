import React from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

import schema from '../schema/loginSchema';
import UserService from '../services/userApi';

let LoginForm = (props) => {
	return (
		<Formik
			validationSchema={schema}
			onSubmit={(values) => {
				let userService = new UserService();
				userService
					.loginExisitingUser(values)
					.then((response) => {
						let data = response.data;
						props.handleLogin(data);
					})
					.catch((error) => {
						props.handleError(error);
					});
			}}
			initialValues={{
				email: '',
				password: '',
			}}
		>
			{(formikProps) => (
				<Form noValidate onSubmit={formikProps.handleSubmit}>
					<div className='px-3 pb-4'>
						<Form.Group>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='text'
								name='email'
								placeholder='Email address'
								value={formikProps.values.email}
								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								isInvalid={
									formikProps.touched.email && formikProps.errors.email
								}
								required
							/>
							<Form.Control.Feedback type='invalid'>
								{formikProps.errors.email}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								name='password'
								placeholder='Password'
								value={formikProps.values.password}
								onBlur={formikProps.handleBlur}
								onChange={formikProps.handleChange}
								isInvalid={
									formikProps.touched.password &&
									formikProps.errors.password
								}
								required
							/>
							<Form.Control.Feedback type='invalid'>
								{formikProps.errors.password}
							</Form.Control.Feedback>
						</Form.Group>
						<div className='d-flex justify-content-end'>
							<Button variant='contained' color='primary' type='submit'>
								Login
							</Button>
						</div>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default LoginForm;
