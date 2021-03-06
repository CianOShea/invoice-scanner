import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import './main.css'
import './styles/main.css'
import App from './App';
import Upload from './Upload'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './Routes';
import * as serviceWorker from './serviceWorker';
import Sidebar from './components/Sidebar';

ReactDOM.render(
  <React.StrictMode>    
    <Router>
      <Routes />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
