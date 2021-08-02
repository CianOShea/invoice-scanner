import React, { useState, useEffect ,Component, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Cookie from 'js-cookie'
import firebase from '../firebase/firebase'
const db = firebase.firestore();

function Navbar() {
  const history = useHistory(); 

  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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

    return (
      <div>
        <header className="text-gray-600 body-font">
          <div className="justify-between mx-auto flex flex-wrap p-5 pb-0 flex-col md:flex-row items-center">
            <Link to="/Home" className="no-underline flex title-font font-medium items-center text-gray-900 md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <h2 className='ml-3 text-xl no-underline text-gray-600 hover:text-gray-900' >Scanner App</h2>
            </Link>
            <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
              {
                isLoggedIn &&
                <Fragment>
                  <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Invoice">Invoice</Link>
                  <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Bank">Bank</Link>
                  <button onClick={() => signOut()}>Log Out</button>
                </Fragment>
              }
              {
                !isLoggedIn &&
                <Link className='no-underline mr-5 text-gray-600 hover:text-gray-900' to="/Login">Login</Link>
              }
              
            </nav>
          </div>
        </header>
        <hr/>
      </div>
    )
};

export default Navbar;