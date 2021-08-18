import React, { useState, useEffect ,Component, Fragment } from 'react';
import { Tooltip, Position } from 'evergreen-ui'
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faPrint, faArchive, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
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
            setCurrentTab('Home')
            Cookie.remove('token');
            history.push('/')
            }).catch((error) => {
            // An error happened.
        });
    }
    return (
        <div className="flex flex-col items-center lg:items-start w-20 lg:w-48 h-screen px-2 lg:px-4 py-8 bg-gray-800 border-r dark:bg-gray-800 dark:border-gray-600 fixed z-10">
            <div className='flex flex-row'>
                <Link to="/Home" className="no-underline flex justify-start title-font font-medium items-center text-gray-900 lg:mb-0"> 
                    <Tooltip content="Home" position={Position.RIGHT}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="lg:mr-2 w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </Tooltip>
                    <div className='hidden lg:flex content-center m-auto items-center mt-2'>
                        <h2 className='text-2xl font-semibold text-white dark:text-white'>Scanner</h2>
                    </div>
                </Link>   
            </div>    
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                {
                     isLoggedIn &&
                    <Fragment>
                        <Tooltip content="Invoice" position={Position.RIGHT}>
                            <Link className={`no-underline flex items-center px-4 py-2 text-white ${props.currentTab === 'Invoice' && "bg-blue-600"} rounded-lg dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white`} to="/Invoice">                                                           
                                <FontAwesomeIcon icon={faArchive} />                            
                                <span className="hidden lg:flex mx-4 text-xl font-medium text-white">Invoice</span>
                            </Link>      
                        </Tooltip>                  
                        <Tooltip content="Bank" position={Position.RIGHT}>
                            <Link className={`no-underline flex items-center px-4 py-2 mt-5 text-white ${props.currentTab === 'Bank' && "bg-blue-600"} transition-colors duration-200 transform rounded-lg dark:text-gray-400 hover:bg-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-white`} to="/Bank">                                    
                                <FontAwesomeIcon icon={faWallet} />
                                <span className="hidden lg:flex mx-4 text-xl font-medium text-white">Bank</span>
                            </Link>   
                        </Tooltip>
                    </Fragment>
                }
                </nav>
                <div className="flex justify-center ">
                    {
                        isLoggedIn &&
                        <Fragment>
                            <div className="flex justify-center ">
                                <button onClick={() => signOut()} className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-2 lg:px-8 focus:outline-none hover:bg-indigo-600 lg:rounded rounded-full text-lg">
                                    <Tooltip content="Sign Out" position={Position.RIGHT}>    
                                        <div className='flex content-center items-center'>                                                                        
                                            <FontAwesomeIcon icon={faSignInAlt} className="h-6 w-6 text-white hover:text-indigo-600 transition duration-200 lg:mr-2"/>  
                                            <span className='hidden lg:flex font-semibold text-white dark:text-white'>Sign Out</span>
                                        </div>
                                    </Tooltip>
                                </button>
                            </div>
                        </Fragment>
                    }         
                    {
                        !isLoggedIn &&
                        <Fragment>
                            <div className="flex justify-center lg:ml-12">
                                <Link onClick={() => setCurrentTab('Login')} className='no-underline' to="/Login">
                                    <button className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-2 lg:px-8 focus:outline-none hover:bg-indigo-600 lg:rounded rounded-full text-lg">
                                        <Tooltip content="Login" position={Position.RIGHT}>  
                                            <div className='flex content-center items-center'>                                              
                                                <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-white hover:text-indigo-600 transition duration-200 lg:mr-2"/>                   
                                                <span className='hidden lg:flex font-semibold text-white dark:text-white'>Login</span>
                                            </div>
                                        </Tooltip>
                                    </button>
                                </Link>
                            </div>
                        </Fragment>
                    }        
                </div>
            </div>
        </div>
    )
    
}

export default Sidebar
