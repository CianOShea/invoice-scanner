import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export class Home extends Component {
    render() {
        return (
            <div className='grid grid-cols-12'>
                <div className="col-span-2">
                  <Sidebar currentTab={'Home'}/>
                </div>  

                <div className="col-span-10">
                    Home
                    <button onClick={() => {window.ipcRenderer.send('open-install-window', 'ping')}}>Open Install</button>
                </div>
            </div>
        )
    }
}

export default Home
