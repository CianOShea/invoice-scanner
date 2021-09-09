import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export class Home extends Component {
    onDashboard(){
        window.shell.openExternal('https://scanner-website.herokuapp.com/dashboard')
    }
    render() {
        console.log(this.props.history);
        return (
            <div className='grid grid-cols-12 border-t-2'>
                <div className="col-span-2">
                  <Sidebar currentTab={'Home'}/>
                </div>  

                <div className="col-span-10"> 
                    <section className="text-gray-600 body-font">
                        <div className="container px-5 py-5 mt-10 mx-auto">
                            <div className="flex flex-wrap w-full flex-col items-center text-center">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Scanner App</h1>
                            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">Easy to use Machine Learning Software. Automatically extract structured data from your documents.</p>
                            </div>
                        </div>
                    </section>                  
                    <button onClick={() => this.onDashboard()} className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"><a>View Dashboard</a></button>
                    

                    <div className="flex justify-between mt-20 mb-10 p-2">
                        <div className="flex w-1/2 items-center justify-center mr-4">                            
                            <div>
                                <button onClick={() => this.props.history.push('/Invoice')} className="flex text-white bg-blue-600 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg"><a>Scan Invoice</a></button>
                            </div>
                        </div>

                        <div className="flex w-1/2 items-center justify-center">                            
                            <div>
                                <button onClick={() => this.props.history.push('/Bank')} className="flex text-white bg-blue-600 border-0 py-2 px-8 focus:outline-none hover:bg-blue-800 rounded text-lg"><a>Scan Document</a></button>
                            </div>
                        </div>                

                    </div>
                </div>
            </div>
        )
    }
}

export default Home
