import React, { Component } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Heading, Paragraph, Pane } from 'evergreen-ui'
import firebase from '../firebase/firebase'
const db = firebase.firestore();

export class Home extends Component {
    onDashboard(){
        window.shell.openExternal('https://scanner-website.herokuapp.com/dashboard')
    }

    componentDidMount(){
        const uploadsRef = db.collection('uploads')

        // const unsubscribe = uploadsRef.onSnapshot(snapshot => {
        //     let changes = snapshot.docChanges();
        //     changes.forEach(change => {
        //         if (change.type === 'modified') {
        //             console.log('Update: ', change.doc.data());
        //         }
        //     })           
        // })
        
        // return () => unsubscribe()
    }
    render() {
        console.log(this.props.history);
        return (
            <div className='mainPage'>
                <div className="sidebarImport">
                  <Sidebar currentTab={'Home'}/>
                </div>  

                <div className="mainContent"> 
                    <section>                        
                        <Pane display='flex' flexDirection='column' marginBottom={50} textAlign='center'>
                            <Heading size={900} marginBottom={20} marginTop={100}>InvoSync</Heading>
                            <Paragraph size={900}>Easy to use Machine Learning Software.</Paragraph>
                            <Paragraph size={900}>Automatically extract structured data from your documents.</Paragraph>
                        </Pane>
                    </section>                  
                    <button onClick={() => this.onDashboard()} className="homeDashboardButton">View Dashboard</button>                    

                    <Pane display='flex' flexDirection='row' marginTop={60} marginBottom={10} padding={2} textAlign='center' justifyContent='space-evenly'>
                       
                        <div>
                            <button onClick={() => this.props.history.push('/Invoice')} className="homeScanButton">Scan Invoice</button>
                        </div>    
                                                
                        <div>
                            <button onClick={() => this.props.history.push('/Statement')} className="homeScanButton">Scan Document</button>
                        </div>
                    </Pane>

                    <div>
                        <div className="flex flex-wrap w-full flex-col items-center text-center bg-green-400">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Tailwind Test</h1>
                            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">Easy to use Machine Learning Software. Automatically extract structured data from your documents.</p>                  
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
