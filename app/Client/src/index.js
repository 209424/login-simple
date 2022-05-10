import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './Styles/index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import {BrowserRouter} from 'react-router-dom';

const rootContainer = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootContainer);

root.render(
		<BrowserRouter>
			<App/>
		</BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
