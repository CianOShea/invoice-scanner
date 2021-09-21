import React, { useState, useEffect ,Component, Fragment } from 'react';
import { Tooltip, Position, Pane, Heading } from 'evergreen-ui'
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
        <div className="sidebar">
                <Link to="/Home" className="homeLink"> 
                    <Tooltip content="Home" position={Position.RIGHT}>
                        <svg className="sidebarLogo" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </Tooltip>
                    <div className='sidebarTitleDiv'>
                        <h2 className='sidebarTitle'>InvoSync</h2>
                    </div>
                </Link>   
            <div className="sidebarContent">
                <nav>
                {
                     isLoggedIn &&
                    <Fragment>
                        <Tooltip content="Invoice" position={Position.RIGHT}>
                            <Link className={`sidebarItem ${props.currentTab === 'Invoice' && "backgroundBlue600"}`} to="/Invoice">                                                           
                                <FontAwesomeIcon icon={faArchive} />                            
                                <span className="sidebarItemTitle">Invoice</span>
                            </Link>      
                        </Tooltip>                  
                        <Tooltip content="Statement" position={Position.RIGHT}>
                            <Link className={`sidebarItem ${props.currentTab === 'Statement' && "backgroundBlue600"}`} to="/Statement">                                    
                                <FontAwesomeIcon icon={faWallet} />
                                <span className="sidebarItemTitle">Statement</span>
                            </Link>   
                        </Tooltip>
                    </Fragment>
                }
                </nav>
                {
                    isLoggedIn &&
                    <Fragment>
                            <button onClick={() => signOut()} className="sidebarButton">
                                <Tooltip content="Sign Out" position={Position.RIGHT}>    
                                    <div className='sidebarButtonContent'>                                                                        
                                        <FontAwesomeIcon icon={faSignOutAlt} className="sidebarButtonLogo"/>  
                                        <span className='sidebarButtonTitle'>Sign Out</span>
                                    </div>
                                </Tooltip>
                            </button>
                    </Fragment>
                }         
                {
                    !isLoggedIn &&
                    <Fragment>
                        <Link className="sidebarLogimButton" onClick={() => setCurrentTab('Login')} textDecoration='none' to="/Login">
                            <button className="sidebarButton">
                                <Tooltip content="Login" position={Position.RIGHT}>  
                                    <div className='sidebarButtonContent'>                                              
                                        <FontAwesomeIcon icon={faSignInAlt} className="sidebarButtonLogo"/>                   
                                        <span className='sidebarButtonTitle'>Login</span>
                                    </div>
                                </Tooltip>
                            </button>
                        </Link>
                    </Fragment>
                }        
            </div>
        </div>
    )
    
}

export default Sidebar
