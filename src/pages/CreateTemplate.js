import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import ReactDataSheet from 'react-datasheet';
import '../index.css';
import '../grid.css';
import { Button, Pane, Heading, Strong, toaster } from 'evergreen-ui'
import Cookie from 'js-cookie'
import firebase from '../firebase/firebase'
const db = firebase.firestore();

const staticGrid = [[{ value: ''}], [{ value: ''}], [{ value: ''}], [{ value: ''}]]

class CreateTemplate extends Component {

          constructor(props) {
                    super(props);
                    
                    this.state = {   
                              pageLoaded: false,
                              userToken: '',
                              paymentID: '',
                              isLoggedIn: false,
                              redirect: null,
                              grid: staticGrid,
                              header: [[{ value: ''}]],
                              templateName: '',
                              templateHeaders: [{ mainTitle: '' , additionalTitles: [{ title: '' }]}]
                    }
          }

          componentDidMount(){
                    
                    firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                              db.collection("users").doc(user.uid).get().then((doc) => {
                              if (doc.exists) {
                                        this.setState({ userToken: user.uid, isLoggedIn: true, pageLoaded: true, paymentID: doc.data().paymentID })                                           
                              } else {
                              // doc.data() will be undefined in this case
                                        console.log("No such document!");
                              }
                              }).catch((error) => {
                                        console.log("Error getting document:", error);
                                        this.setState({ pageLoaded: true, redirect: '/Login' })
                              });
                    } else {
                              // No user is signed in.
                              console.log('Not logged In');
                              this.setState({ pageLoaded: true, redirect: '/Login' })
                    }
                    });          
          }

          onChange(e){
                    this.setState({
                              [e.target.name]: e.target.value
                    })
          }

          editMainHeader(e, tempHeaderIndex){
                    const { templateHeaders, header } = this.state
                    templateHeaders[tempHeaderIndex].mainTitle = e.target.value
                    header[0][tempHeaderIndex].value = e.target.value
                    this.setState({ templateHeaders, header })
          }

          editAdditionalOptions(e, tempHeaderIndex, additionalTitleIndex){
                    const { templateHeaders } = this.state
                    templateHeaders[tempHeaderIndex].additionalTitles[additionalTitleIndex].title = e.target.value
                    this.setState({ templateHeaders })
          }

          addHeader(e){
                    const { templateHeaders, header, grid } = this.state
                    templateHeaders.push({ mainTitle: '' , additionalTitles: [{ title: '' }]})
                    header[0].push({ value: '' })
                    for (var i = 0; i < grid.length; i++) {
                              grid[i].push({ value: '' })
                    }

                    this.setState({ templateHeaders, header, grid })
          }

          addAdditionalOption(index){
                    const { templateHeaders } = this.state
                    templateHeaders[index].additionalTitles.push({ title: '' })
                    this.setState({ templateHeaders })
          }

          removeHeader(index){
                    const { templateHeaders, header, grid } = this.state
                    console.log(templateHeaders.length);
                    if(templateHeaders.length === 1){
                              this.setState({ templateHeaders: [{ mainTitle: '' , additionalTitles: [{ title: '' }]}], header: [[{ value: ''}]] })
                    } else {
                              templateHeaders.splice(index, 1)
                              header[0].splice(index, 1)
                              for (var i = 0; i < grid.length; i++) {
                                        grid[i].splice(index, 1)
                              }
                              this.setState({ templateHeaders, header, grid })
                    }    
          }

          removeAdditionalOption(tempHeaderIndex, additionalTitleIndex){
                    const { templateHeaders } = this.state
                    console.log(tempHeaderIndex);
                    console.log(additionalTitleIndex);
                    templateHeaders[tempHeaderIndex].additionalTitles.splice(additionalTitleIndex, 1)
                    this.setState({ templateHeaders })
          }

          createTemplate(){
                    const { templateName, templateHeaders, paymentID } = this.state
                    console.log(templateHeaders)

                    if(templateName === ""){
                              toaster.danger("Please ensure all field are filled in");
                              return
                    }
                    for (var i = 0; i < templateHeaders.length; i++) {
                              if(templateHeaders[i].mainTitle === ""){
                                        toaster.danger("Please ensure all field are filled in");
                                        return
                              }
                              
                    }

                    const template = { name: templateName, headers: [] }
                    for (var i = 0; i < templateHeaders.length; i++) {
                              var additionalTitleValues = []
                              templateHeaders[i].additionalTitles.map(additionalTitle => ( additionalTitleValues.push(additionalTitle.title) ))
                              template.headers.push({mainTitle: templateHeaders[i].mainTitle, additionalTitles: additionalTitleValues})
                    }
                    console.log(template);

                    if(template.headers.length < 1){
                              toaster.danger("Please ensure all field are filled in");
                              return    
                    }                    

                    const templateRef = db.collection("teams").doc(paymentID)

                    try {
                              templateRef.get().then(doc => {
                                        if(doc.exists){
                                                  templateRef.update({ templates: firebase.firestore.FieldValue.arrayUnion(template)  });
                                                  toaster.success("Template Created");
                                        } else {
                                                  console.log('Doc does not exist');
                                        }
                              })
                    } catch (error) {
                              console.error(error);
                    }
                    
                  
          }

          render() {
                    const { pageLoaded, isLoggedIn, redirect, grid, header, templateHeaders } = this.state

                    console.log(templateHeaders);

                    if(pageLoaded){
                              if(!isLoggedIn){
                                        return (
                                                  <Redirect to={redirect} />
                                        )
                              }
                    }

                    return (
                              <div className='mainPage'>
                                        <div className="sidebarImport"></div>
                                        
                                        <div className="mainContent pr-10 pl-5 pt-5">  
                                                  <div className='h-screen max-h-screen'>
                                                            <div className='p-10 justify-center items-center rounded-lg shadow-lg'>
                                                                      <div className='h-4/6 m-h-4/6 overflow-auto'>
                                                             
                                                                                <Heading textAlign='center' size={900} marginBottom={50}>Create Template</Heading>
                                                                                <div className='flex flex-row mt-10 mb-5 items-center justify-center space-x-4'>
                                                                                          <Strong size={600}>Template Name:</Strong>
                                                                                          <input onChange={e => this.onChange(e)} name="templateName" id="templateName" className="block w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outlint-none" type="email" />
                                                                                </div>
                                                                                {
                                                                                          templateHeaders.map(((tempHeader, tempHeaderIndex) => (
                                                                                          
                                                                                                    <div className='flex flex-row w-full'>
                                                                                                              <button onClick={e => this.removeHeader(tempHeaderIndex)} className="text-white bg-red-700 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600">
                                                                                                                        Remove Header
                                                                                                              </button>
                                                                                                              <div className='flex flex-col w-full p-2'>
                                                                                                                        <div className='flex flex-col'>
                                                                                                                                  <Strong size={600}>Main Term</Strong>                                                                                                                                                                             
                                                                                                                                  <input onChange={e => this.editMainHeader(e, tempHeaderIndex)} value={tempHeader.mainTitle} key={tempHeaderIndex} name={`mainTitle:${tempHeaderIndex}`} id={`${tempHeaderIndex}`} className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outlint-none" type="email" />
                                                                                                                        </div>  
                                                                                                              </div>
                                                                                                              <div className='flex flex-col w-full p-2'>
                                                                                                                        <div className='flex flex-col'>
                                                                                                                                  <Strong size={600}>Additional Options</Strong> 
                                                                                                                                  {         tempHeader.additionalTitles.map(((additionalTitle, additionalTitleIndex) => (
                                                                                                                                                      <div>
                                                                                                                                                                <input onChange={e => this.editAdditionalOptions(e, tempHeaderIndex, additionalTitleIndex)} value={additionalTitle.title} key={additionalTitleIndex} name="additionalTitle" id="additionalTitle" className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outlint-none" type="email" />
                                                                                                                                                                <button onClick={e => this.removeAdditionalOption(tempHeaderIndex, additionalTitleIndex)} className="text-white bg-red-700 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600">
                                                                                                                                                                          Remove Additional
                                                                                                                                                                </button>
                                                                                                                                                      </div>
                                                                                                                                            )))
                                                                                                                                  }                                                                                                                        
                                                                                                                                  <button onClick={e => this.addAdditionalOption(tempHeaderIndex)} className="w-full mt-2 px-4 py-2 tracking-wide text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                                                                                                                            Add Additional Search Options
                                                                                                                                  </button>
                                                                                                                                  
                                                                                                                        </div>
                                                                                                              </div>
                                                                                                    </div>
                                                                                          )))
                                                                                }
                                                                                <div className='flex justify-center'>
                                                                                          <button onClick={e => this.addHeader(e)} className="w-1/3 px-4 py-2 tracking-wide text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                                                                                    Add Additional Search Header
                                                                                          </button>
                                                                                </div>

                                                                                <div className='flex justify-center'>
                                                                                          <button onClick={e => this.createTemplate(e)} className="w-1/3 px-4 py-2 tracking-wide text-white bg-gray-700 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                                                                                                    Create Template +
                                                                                          </button>
                                                                                </div>

                                                                      </div>

                                                            </div>
                                                            
                                                            <div className='h-2/6 m-h-1/2'>
                                                                      <div className='datasheetContainer'>
                                                                                <ReactDataSheet
                                                                                          data={header}
                                                                                          valueRenderer={cell => { cell.readOnly = true; return cell.value; }}                                      
                                                                                />
                                                                                <ReactDataSheet
                                                                                          data={this.state.grid}
                                                                                          valueRenderer={cell => cell.value}
                                                                                          // onCellsChanged={changes => {
                                                                                          // const grid = this.state.grid.map(row => [...row]);
                                                                                          // changes.forEach(({ cell, row, col, value }) => {
                                                                                          //           grid[row][col] = { ...grid[row][col], value };
                                                                                          // });
                                                                                          //           this.setState({ grid });
                                                                                          // }}                        
                                                                                />
                                                                                
                                                                      </div>   
                                                            </div>
                                                  </div>
                                        </div>                                       
                              </div>
                    )
          }
}

export default CreateTemplate
