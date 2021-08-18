import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export class Home extends Component {
    onDashboard(){
        window.shell.openExternal('https://scanner-website.herokuapp.com/dashboard')
    }
    render() {
        return (
            <div className='grid grid-cols-12'>
                <div className="col-span-2">
                  <Sidebar currentTab={'Home'}/>
                </div>  

                <div className="col-span-10">                    
                    <button onClick={() => this.onDashboard()} className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"><a>View Dashboard</a></button>
                </div>
            </div>
        )
    }
}

export default Home
