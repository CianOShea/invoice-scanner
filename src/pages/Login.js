import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import { Link, withRouter } from 'react-router-dom';
import firebase from '../firebase/firebase'
import Cookie from 'js-cookie'
import Sidebar from '../components/Sidebar'

export default class login extends Component {

    constructor(props) {
        super(props);
        this.state = { 
        email: '',
        password: '',
        };
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSignUp(e) {
        e.preventDefault()
        const { email, password } = this.state

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            Cookie.set('token', result.user.uid);     
            this.props.history.push('/Home') 
        })
        .catch((error) => {
            console.log(error)
        })
        
    }  

    onRegister(){
        window.shell.openExternal('https://scanner-website.herokuapp.com/register')
    }  

    render() {
        const { email, password } = this.state
        return (
            <div className='grid grid-cols-12'>
                <div className="col-span-2">
                    <Sidebar currentTab={'Login'}/>
                </div>  
                <div className="col-span-10"> 
                    <div className="flex max-w-sm mx-auto mt-20 overflow-hidden  place-content-center bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-3xl">
                        
                        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
                            <h2 className="text-3xl font-semibold text-center text-gray-700 dark:text-white">Scanner App</h2>
                            <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-white">Login</h2>

                            <div className="mt-4">
                                <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="LoggingEmailAddress">Email Address</label>
                                <input onChange={e => this.onChange(e)} name="email" id="LoggingEmailAddress" className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" type="email" />
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200" htmlFor="loggingPassword">Password</label>
                                    <a href="#" className="text-xs text-gray-500 dark:text-gray-300 hover:underline">Forget Password?</a>
                                </div>

                                <input onChange={e => this.onChange(e)} name="password" id="loggingPassword" className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" type="password"/>
                            </div>

                            <div className="mt-8">
                                <button onClick={e => this.onSignUp(e)} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                    Login
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                                    <a href='#' onClick={() => this.onRegister()} className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline">or sign up</a>                        
                                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>   
        )
    }
}
