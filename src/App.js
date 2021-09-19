import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css'

class App extends Component {

  render(){ 
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={() => {window.ipcRenderer.send('closeApp')}}>Test ipcCommunication (Closes App)</button>
          <button onClick={() => {window.ipcRenderer.send('test', 'ping')}}>Test Send</button>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

export default App;
