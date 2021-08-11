import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export class Home extends Component {
    render() {
        return (
            <div className='grid md:grid-cols-12 ml-56'>
                <div className="md:col-span-12">  
                    Home
                </div>
            </div>
        )
    }
}

export default Home
