import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Start from './components/start';
import SignUp from './components/signup-component/signup';
import Login from './components/login-component/login';
import Admin from './components/admin-component/admin';
import Examiner from './components/examiner-component/examiner';
import ProtectedRoute from './hoc/protectedRoute';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Start}></Route>
				<Route path='/signup' component={SignUp}></Route>
				<Route path='/login' component={Login}></Route>
				<Route path='/admin' component={ProtectedRoute(Admin)}></Route>
				<Route
					path='/examiner'
					component={ProtectedRoute(Examiner)}
				></Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
