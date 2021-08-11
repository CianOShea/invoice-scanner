import React, { useState, useEffect ,Component, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faPrint } from '@fortawesome/free-solid-svg-icons'
import Cookie from 'js-cookie'
import firebase from '../firebase/firebase'
const db = firebase.firestore();

function Sidebar(props) {

    const history = useHistory(); 

    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentTab, setCurrentTab] = useState('Home')

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
            setUser(user)
            setIsLoggedIn(true)
            } else {
            // No user is signed in.
            setUser(null)
            setIsLoggedIn(false)
            }
        });
    }, []) 


    const signOut = () => {    
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            Cookie.remove('token');
            history.push('/')
            }).catch((error) => {
            // An error happened.
        });
    }
    console.log(props);
    return (
        <div className="flex flex-col w-56 h-screen px-4 py-8 bg-gray-800 border-r dark:bg-gray-800 dark:border-gray-600 fixed z-40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <Link onClick={() => setCurrentTab('Home')} to="/Home" className="no-underline flex title-font font-medium items-center text-gray-900 md:mb-0">                
                <h2 className='text-2xl font-semibold text-white dark:text-white' >Scanner App</h2>
            </Link>       
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <Link onClick={() => setCurrentTab('Invoice')} className={`no-underline flex items-center px-4 py-2 text-white ${currentTab === 'Invoice' && "bg-blue-600"} rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white`} to="/Invoice">    
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="mx-4 font-medium text-white">Invoice</span>
                    </Link>
                    

                    <Link onClick={() => setCurrentTab('Bank')} className={`no-underline flex items-center px-4 py-2 mt-5 text-white ${currentTab === 'Bank' && "bg-blue-600"} transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white`} to="/Bank">    
                        <FontAwesomeIcon icon={faWallet} />
                        <span className="mx-4 font-medium text-white">Bank</span>
                    </Link>   
                </nav>
                <div className="flex justify-center ">
                <button onClick={() => signOut()} className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"><a>Sign Out</a></button>
                </div>
                <div className="flex justify-center ">
                    <img className="object-cover mx-2 rounded-full h-12 w-12" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="avatar"/>                
                </div>
            </div>
        </div>
    )
    
}

export default Sidebar
