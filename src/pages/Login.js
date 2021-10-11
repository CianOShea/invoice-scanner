import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import { Link, withRouter } from 'react-router-dom';
import firebase from '../firebase/firebase'
import Cookie from 'js-cookie'
import Sidebar from '../components/Sidebar'
import { Pane, Heading, Strong, Text } from 'evergreen-ui'

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
            this.props.history.push('/Invoice') 
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
            <div className='mainPage'>
                <div className="sidebarImport">
                    <Sidebar currentTab={'Login'}/>
                </div>  
                <div className="mainContent"> 
                    <div className="loginContainer">
                        
                        <Pane width='100%' padding={50}>
                            <Heading textAlign='center' size={900}>InvoSync</Heading>
                            <Heading textAlign='center' size={700}>Login</Heading>

                            <Pane marginTop={30}>
                                <Strong size={400}>Email Address</Strong>
                                <input onChange={e => this.onChange(e)} name="email" id="LoggingEmailAddress" className="loginInput" type="email" />
                            </Pane>

                            <Pane marginTop={30}>
                                <Pane display='flex' justifyContent='space-between'>
                                    <Strong size={400}>Password</Strong>
                                    <a href="#" className="loginLinks">Forget Password?</a>
                                </Pane>

                                <input onChange={e => this.onChange(e)} name="password" id="loggingPassword" className="loginInput" type="password"/>
                            </Pane>

                            <Pane marginTop={50}>
                                <button onClick={e => this.onSignUp(e)} className="loginButton">
                                    Login
                                </button>
                            </Pane>
                            
                            <Pane display='flex' alignItems='center' justifyContent='space-between' marginTop={30}>
                                <span className="loginDivider"></span>
                                    <a href='#' onClick={() => this.onRegister()} className="loginLinks">OR SIGN UP</a>                        
                                <span className="loginDivider"></span>
                            </Pane>
                        </Pane>
                    </div>
                </div>
            </div>   
        )
    }
}
