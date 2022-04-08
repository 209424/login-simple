import React from 'react';
import './Styles/App.css';
import {Routes, Route, Link} from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import ErrorPage from './Pages/ErrorPage';

function App() {
	return (
		<div className='App'>
			<nav>
				<Link to='/'>Home</Link>
				<Link to='/about'>About</Link>
				<Link to='/login'>Login</Link>
				<Link to='/register'>Register</Link>
				<Link to='/profile'>Profile</Link>
			</nav>

			<Routes>
				<Route path='/' element={<Home/>}/>
				<Route path='/about' element={<About/>}/>
				<Route path='/login' element={<Login/>}/>
				<Route path='/register' element={<Register/>}/>
				<Route path='/profile/:userId' element={<Profile/>}/>
				<Route path='*' element={<ErrorPage/>}/>
			</Routes>
		</div>
	);
}

export default App;