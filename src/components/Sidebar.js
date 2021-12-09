import React, { useState, useEffect ,Component, Fragment } from 'react';
import { Tooltip, Position, Pane, Heading, Button, HomeIcon } from 'evergreen-ui'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faPrint, faArchive, faSignInAlt, faSignOutAlt, faFileInvoice, faTable, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Cookie from 'js-cookie'
import firebase from '../firebase/firebase'
const db = firebase.firestore();

function Sidebar(props) {

    const history = useHistory(); 
    const location = useLocation();
    // console.log(location) 

    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentTab, setCurrentTab] = useState('Home')
    const [templates, setTemplates] = useState([])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
            setUser(user)
            setIsLoggedIn(true)
            
            db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    Cookie.set('paymentID', doc.data().paymentID)
                    db.collection("teams").doc(doc.data().paymentID).get().then((doc) => {
                        if (doc.exists) {
                            setTemplates(doc.data().templates)                            
                            
                            // console.log(doc.data().templates)
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    })    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            } else {
                // No user is signed in.
                setUser(null)
                setIsLoggedIn(false)
            }
        });

        const paymentID = Cookie.get("paymentID")
        if(paymentID){
            const templateRef = db.collection("teams").doc(paymentID)
            const unsubscribe = templateRef.onSnapshot(snapshot => {
                console.log(snapshot.data());
                setTemplates(snapshot.data().templates) 
                // history.push('/')   
            })
        }
        
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

    const onDashboard = () => {
        window.shell.openExternal('https://scanner-website.herokuapp.com/dashboard')
    }

    return (
        <div className="sidebar">
            <Pane display='flex' flexDirection='row' alignItems='center'>
                <svg className="sidebarLogo" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <div className='sidebarTitleDiv'>
                    <h2 className='sidebarTitle'>InvoSync</h2>
                </div>
            </Pane>
            <div className="flex flex-col justify-between mt-6 max-w-100 overflow-auto">
                <nav id='sidebar' className='overflow-auto pr-1'>
                {
                    isLoggedIn &&
                    <Fragment>
                        <Tooltip content="Invoice" position={Position.RIGHT}>
                            <Link className={`flex no-underline items-center px-2 py-2 mt-5 text-white rounded-lg justify-center lg:justify-start hover:bg-blue-600 ${location.pathname === '/Invoice' && "backgroundBlue600"}`} to="/Invoice">                                                           
                                <div className="flex px-2">
                                    <FontAwesomeIcon icon={faFileInvoice} />
                                </div>                           
                                <span className="hidden text-xl font-medium px-2 lg:flex">Invoice</span>
                            </Link>      
                        </Tooltip>                  
                        <Tooltip content="Statement" position={Position.RIGHT}>
                            <Link className={`flex no-underline items-center px-2 py-2 mt-4 text-white rounded-lg justify-center lg:justify-start hover:bg-blue-600 ${location.pathname === '/Statement' && "backgroundBlue600"}`} to="/Statement">                                    
                                <div className="flex px-2">
                                    <FontAwesomeIcon icon={faTable} />
                                </div>
                                <span className="hidden text-xl font-medium px-2 lg:flex">Statement</span>
                            </Link>   
                        </Tooltip>
                        {
                            templates.map((template, index) => (
                                <Tooltip content={template.name} position={Position.RIGHT}>
                                    <Link className={`flex no-underline items-center px-2 py-2 mt-4 text-white rounded-lg justify-center lg:justify-start hover:bg-blue-600 ${location.pathname === `/${template.name}` && "backgroundBlue600"}`} to={{pathname: `/${template.name}`, query: {templateData: template}}}>                                    
                                        <div className="flex px-2">
                                            <FontAwesomeIcon icon={faTable} />
                                        </div>
                                        <span className="hidden text-xl font-medium px-2 lg:flex">{template.name}</span>
                                    </Link>   
                                </Tooltip>
                            ))
                        }   

                        
                    </Fragment>
                }
                </nav>

                <Tooltip content="Create Template +" position={Position.RIGHT}>
                    <Link className={`flex no-underline items-center px-2 py-2 mt-4 text-white rounded-lg justify-center lg:justify-start hover:bg-blue-600 bg-blue-800`} to="/CreateTemplate">                                    
                        <div className="flex px-2">
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </div>
                        <span className="hidden text-xl font-medium px-2 lg:flex">Create +</span>
                    </Link>   
                </Tooltip>
                
                <button onClick={() => onDashboard()} className="flex mx-auto items-center text-white bg-green-500 mt-4 mb-4 py-2 px-2 focus:outline-none hover:bg-green-600 rounded text-md">
                    <div className="flex px-2">
                        <HomeIcon color='white'/>
                    </div>
                    <span className="hidden text-xl font-medium px-2 lg:flex">Dashboard</span>      
                </button>
                {
                    isLoggedIn &&
                    <div className='mt-4 bottom-0'>
                            <button onClick={() => signOut()} className="sidebarButton">
                                <Tooltip content="Sign Out" position={Position.RIGHT}>    
                                    <div className='sidebarButtonContent'>                                                                        
                                        <FontAwesomeIcon icon={faSignOutAlt} className="sidebarButtonLogo"/>  
                                        <span className='sidebarButtonTitle'>Sign Out</span>
                                    </div>
                                </Tooltip>
                            </button>
                    </div>
                }         
                {
                    !isLoggedIn &&
                    <div className='mt-4'>
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
                    </div>
                }        
            </div>
        </div>
    )
    
}

export default Sidebar
