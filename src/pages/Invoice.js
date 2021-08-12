/* eslint-disable no-loop-func */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import FileBase64 from 'react-file-base64';
import { Form, FormGroup, FormText } from "reactstrap";
import '../upload.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDataSheet from 'react-datasheet';
import '../index.css';
import '../grid.css';
import { Button, Pane, Text, Table, Heading, Spinner, Dialog, TextInput, SelectMenu, Position, CornerDialog, Tablist, Tab, Paragraph, toaster } from 'evergreen-ui'

import AWS from 'aws-sdk';

import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

import _ from 'lodash'
import Select from 'react-select'

import Cookie from 'js-cookie'

import firebase from '../firebase/firebase'
const db = firebase.firestore();


AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_POOL_ID,
});

AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION
});

const lambda = new AWS.Lambda({region: process.env.REACT_APP_AWS_REGION, apiVersion: '2015-03-31'});


class Invoice extends Component {

   constructor(props) {
      super(props);
      this.myRef = React.createRef();
    
      this.state = {   
          pageLoaded: false,
          userToken: '',
          isLoggedIn: false,
          redirect: null,
          paymentID: '',
          scansExceeded: false,
          appVersion: '-',
          messages: '--',
          progressBar: '---',
          files: '',
          unscannedFiles: [],
          scannedFiles: [],
          scannedFileData: [],
          missingData: [],       
          csv: [],
          keyMap: '',
          formData: '',
          sampleData: [],
          imageDataURL: null,
          sortedForm: {},
          header: [
            [{ value: 'Invoice No.' }, { value: 'Date of Issue' }, { value: 'Company Name' }, { value: 'Subtotal' }, { value: 'VAT' }, { value: 'Total' }]            
          ],
          grid: [
            [{ value: ''}, { value: '' },{ value: '' }, { value: '' },{ value: '' }, { value: '' }],
            [{ value: ''}, { value: '' },{ value: '' }, { value: '' },{ value: '' }, { value: '' }],
            [{ value: ''}, { value: '' },{ value: '' }, { value: '' },{ value: '' }, { value: '' }],
            [{ value: ''}, { value: '' },{ value: '' }, { value: '' },{ value: '' }, { value: '' }],
            [{ value: ''}, { value: '' },{ value: '' }, { value: '' },{ value: '' }, { value: '' }],
            
          ],
          missingDataDialog: false,
          cornerDialog: false,
          form: [],
          array: [],
          xlsxData: [],
          scanComplete: false,
          isScanning: false,
          sampleForm: [{"Key":"Invoice No: ","Value":"00050782 ","Top":0.15887455642223358,"Left":0.6562477350234985},{"Key":"Invoice To: ","Value":"","Top":0.20341408252716064,"Left":0.17773117125034332},{"Key":"Deliver To: ","Value":"Kelly 1 ","Top":0.21346968412399292,"Left":0.41038841009140015},{"Key":"Rachel Kelly 1 ","Value":"","Top":0.22267292439937592,"Left":0.1764025241136551},{"Key":"ATMac Ltd ","Value":"3 Penrose Wharf Cork T23 DK83 Tel: 353 21 4551811 Fax: 353 21 4552362 Email: sales@atmac.net ","Top":0.23922443389892578,"Left":0.5898222327232361},{"Key":"VAT Number: ","Value":"IE8288207D ","Top":0.3106020390987396,"Left":0.16922159492969513},{"Key":"SALESPERSON ","Value":"","Top":0.3303232192993164,"Left":0.20409639179706573},{"Key":"YOUR NO. ","Value":"","Top":0.33356931805610657,"Left":0.32087457180023193},{"Key":"DELIVER VIA ","Value":"","Top":0.336144357919693,"Left":0.3922230303287506},{"Key":"DELIVERY DATE ","Value":"","Top":0.3391297459602356,"Left":0.504290759563446},{"Key":"PG. ","Value":"1 ","Top":0.34121108055114746,"Left":0.7592846751213074},{"Key":"DATE ","Value":"16/09/2020 ","Top":0.34139230847358704,"Left":0.7039451599121094},{"Key":"TERMS ","Value":"C.O.D. ","Top":0.3424052596092224,"Left":0.6150208711624146},{"Key":"SALE AMOUNT ","Value":"193.39 ","Top":0.6819980144500732,"Left":0.5947120189666748},{"Key":"CARRIAGE ","Value":"0.00 S ","Top":0.6930070519447327,"Left":0.6160086989402771},{"Key":"VAT ","Value":"40.61 ","Top":0.7039893865585327,"Left":0.6458079218864441},{"Key":"TOTAL ","Value":"234.00 ","Top":0.7170075178146362,"Left":0.6355307102203369},{"Key":"PAID TODAY ","Value":"234.00 ","Top":0.727240264415741,"Left":0.607796847820282},{"Key":"BALANCE DUE ","Value":"0.00 ","Top":0.7530501484870911,"Left":0.5989195704460144},{"Key":"Epson Support: ","Value":"(01) 4367742 ","Top":0.7737049460411072,"Left":0.6362375617027283},{"Key":"Apple Support: ","Value":"1850 946 191 ","Top":0.7897570729255676,"Left":0.1603955775499344}],
          sampleForm1: [{"Key":"goods ","Value":"184.99 ","Top":0.03183566778898239,"Left":0.31350409984588623},{"Key":"VAT ","Value":"32.11 ","Top":0.03712407872080803,"Left":0.4464055895805359},{"Key":"rate% ","Value":"21.00% ","Top":0.04119955003261566,"Left":0.20616987347602844},{"Key":"Signed: ","Value":"","Top":0.12179794162511826,"Left":0.444637656211853},{"Key":"Customer Signature: ","Value":"","Top":0.15310196578502655,"Left":0.1922277808189392},{"Key":"# Pieces : ","Value":"","Top":0.16576817631721497,"Left":0.6373269557952881}],
          sampleForm2: [{"Key":"","Value":"","Top":0.2716592848300934,"Left":0.3152812123298645},{"Key":"Fax: ","Value":"01 870 4799 ","Top":0.2765476107597351,"Left":0.4768016040325165},{"Key":"Date : ","Value":"22/09/20 ","Top":0.2937704026699066,"Left":0.5079866051673889},{"Key":"Operator : ","Value":"6218/78 Jstewart ","Top":0.29944103956222534,"Left":0.23617011308670044},{"Key":"Time : ","Value":"09:45:57 ","Top":0.30358368158340454,"Left":0.5077069401741028},{"Key":"Customer : ","Value":"0868688216 ","Top":0.3095841109752655,"Left":0.236577570438385},{"Key":"Location : ","Value":"36 ","Top":0.3132050931453705,"Left":0.5085945725440979},{"Key":"Sales Type: ","Value":"ONLINE SALES ","Top":0.31975024938583374,"Left":0.23708169162273407},{"Key":"Transaction : ","Value":"66409 ","Top":0.32272592186927795,"Left":0.5092323422431946},{"Key":"Order : ","Value":"708008 ","Top":0.3303481936454773,"Left":0.23682448267936707},{"Key":"SALES ORDER ","Value":"RACHEL KELLY Bandon Cork 2 Abbey Way, Timoleague, ","Top":0.3516533374786377,"Left":0.2380058616399765},{"Key":"INVOICE ","Value":"19762 ","Top":0.35340070724487305,"Left":0.5648228526115417},{"Key":"Total ","Value":"€179.00 ","Top":0.421538382768631,"Left":0.645291805267334},{"Key":"Price ","Value":"€179.00 ","Top":0.4245971143245697,"Left":0.5403289198875427},{"Key":"Qty ","Value":"1 ","Top":0.42686697840690613,"Left":0.4633452594280243},{"Key":"Payment type: ","Value":"Credit Card ","Top":0.6892822980880737,"Left":0.26270100474357605},{"Key":"Delivery Instructions ","Value":"","Top":0.7412880063056946,"Left":0.5072407722473145},{"Key":"Delivery Address ","Value":"Rachel Kelly 2 Abbey Way, Timoleague, Bandon Cork P72E288 ","Top":0.7578717470169067,"Left":0.24441733956336975},{"Key":"V.A.T. CONTENT ","Value":"€32.11 ","Top":0.8375283479690552,"Left":0.5140318870544434},{"Key":"Phone : ","Value":"0868688216 ","Top":0.847998857498169,"Left":0.2647552788257599},{"Key":"INV PENDING ","Value":"€184.99 ","Top":0.8508192896842957,"Left":0.5148638486862183},{"Key":"BALANCE OWING ","Value":"€184.99 ","Top":0.8613481521606445,"Left":0.5156861543655396}],
          sampleMissingData: [{"scannedFileIndex":0,"fileName":"688306 (1).png","Total":[{"Key":"Total ","Value":"€179.00 ","Top":0.421538382768631,"Left":0.645291805267334},{"Key":"BALANCE OWING ","Value":"€184.99 ","Top":0.8613481521606445,"Left":0.5156861543655396}],"Subtotal":[{"Key":"Total ","Value":"€179.00 ","Top":0.421538382768631,"Left":0.645291805267334},{"Key":"Price ","Value":"€179.00 ","Top":0.4245971143245697,"Left":0.5403289198875427},{"Key":"V.A.T. CONTENT ","Value":"€32.11 ","Top":0.8375283479690552,"Left":0.5140318870544434},{"Key":"INV PENDING ","Value":"€184.99 ","Top":0.8508192896842957,"Left":0.5148638486862183},{"Key":"BALANCE OWING ","Value":"€184.99 ","Top":0.8613481521606445,"Left":0.5156861543655396}]},{"scannedFileIndex":2,"fileName":"129466 (1).png","Date":[],"InvoiceNumber":[],"Subtotal":[{"Key":"goods ","Value":"184.99 ","Top":0.03183566778898239,"Left":0.31350409984588623},{"Key":"VAT ","Value":"32.11 ","Top":0.03712407872080803,"Left":0.4464055895805359},{"Key":"rate% ","Value":"21.00% ","Top":0.04119955003261566,"Left":0.20616987347602844}]},{"scannedFileIndex":3,"fileName":"invoiceDate.pdf","InvoiceNumber":[],"VAT":[],"Total":[],"Subtotal":[]}],
          sampleScannedFileData: [[{"value":"19762 "},{"value":"22/09/20 "},{"value":""},{"value":""},{"value":"€32.11 "},{"value":""}],[{"value":"000000 "},{"value":"10/07/14 "},{"value":""},{"value":"$4000.00 "},{"value":"$520.00 "},{"value":"4520.00"}],[{"value":""},{"value":""},{"value":""},{"value":152.88},{"value":"32.11 "},{"value":"184.99 "}],[{"value":""},{"value":"2/2/22 "},{"value":""},{"value":""},{"value":""},{"value":""}]]
      }
   }

    componentDidMount(){
      window.ipcRenderer.on('test-back', this.handleRenderer)

      window.ipcRenderer.on('message', (event, text) => {

        let message = document.createElement('div')
        // message.innerHTML = text
        // container.appendChild(message)
        console.log(`Message: ${text}`);
        this.setState({ messages: text })

      })

      window.ipcRenderer.on('version', (event, text) => {
        // version.innerText = text
        console.log(`Version: ${text}`);
        this.setState({ appVersion: text})
      })

      window.ipcRenderer.on('download-progress', (event, text) => {
        // progressBar.style.width = `${text}%`
        console.log(`progressBar: ${text}`);
        this.setState({ progressBar: text})
      })
     
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          db.collection("users").doc(user.uid).get().then((doc) => {
              if (doc.exists) {
                  this.setState({ userToken: user.uid, paymentID: doc.data().paymentID, isLoggedIn: true, pageLoaded: true })               
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          }).catch((error) => {
              console.log("Error getting document:", error);
              this.setState({ pageLoaded: true, redirect: '/Home' })
          });
        } else {
          // No user is signed in.
          console.log('Not logged In');
          this.setState({ pageLoaded: true, redirect: '/Home' })
        }
      });

      if(sessionStorage.getItem('invoiceScannedFiles')) { var scannedFiles = JSON.parse(sessionStorage.getItem('invoiceScannedFiles')) } else { var scannedFiles = [] }
      if(sessionStorage.getItem('invoiceScannedFileData')) { var scannedFileData = JSON.parse(sessionStorage.getItem('invoiceScannedFileData')) } else { var scannedFileData = [] }
      if(sessionStorage.getItem('invoiceMissingData')) { var missingData = JSON.parse(sessionStorage.getItem('invoiceMissingData')) } else { var missingData = [] }
      if(sessionStorage.getItem('invoiceXlsxData')) { var xlsxData = JSON.parse(sessionStorage.getItem('invoiceXlsxData')) } else { var xlsxData = [] }
      this.setState({ scannedFiles: scannedFiles, scannedFileData: scannedFileData, missingData: missingData, xlsxData: xlsxData })
    }

    handleRenderer(event, data) {
      console.log(data);
    }

    handleChange(e){
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }


    async handleSubmit(e){
        e.preventDefault();
        this.setState({
            confirmation: 'Uploading...'
        })
    }    

    async getFiles(unscannedFiles, index){ 

        const { scannedFileData, grid } = this.state          
        
        if(unscannedFiles.length < 1){
          console.log('No files detected');
          return
        }
        

        const UID = Math.round( 1 + Math.random() * ( 1000000 - 1 ))

        var data = {
            fileExt: unscannedFiles.fileExt,
            imageID: UID,
            folder: UID,
            img: unscannedFiles.base64,
            fileType: unscannedFiles.fileType
        }
        
        try {
          
          await fetch(process.env.REACT_APP_API_GATEWAY_S3_UPLOAD, 
              {
                  method: 'POST',
                  header: {
                      Accept: 'application/json',
                      'ContentType': 'application/json'
                  },
                  body: JSON.stringify(data)
              }
          )

          const targetImage = data.imageID + '.' + data.fileExt;  

          var pullParams = {
            FunctionName : 'OCR',
            InvocationType : 'RequestResponse',
            LogType : 'None',
            Payload: JSON.stringify(targetImage)
          };
          
          // create variable to hold data returned by that Lambda function
          var pullResults;

          const lambdaPromise = await new Promise((resolve, reject) => lambda.invoke({
            Payload: JSON.stringify(targetImage),
            FunctionName: 'OCR',
          }, (err, result) => ((err) ? reject(err) :
            (result.FunctionError) ? reject({ statusCode: 502, body: result.Payload })
            : resolve(result))))
            
          const lambdaData = JSON.parse(lambdaPromise.Payload)

         

          if(lambdaData.body){            

              if (lambdaData.body.tables) {
                const TABLESmap = Object.values(lambdaData.body.tables);
                // console.log(TABLESmap);

                var datasheetTABLES = []

                for (var k = 0; k < TABLESmap.length; k++) {
                  const splitNLData = TABLESmap[k].split(/\r\n|\r|\n/)
                  var gridData = []

                  for (var i = 0; i < splitNLData.length; i++) {
                      var splitCommaData = splitNLData[i].split(',')
                      var row = []
                      for (var j = 0; j < splitCommaData.length; j++) {
                        var item = {};
                        item.value = splitCommaData[j];
                        row.push(item);              
                      }           
                      gridData.push(row)
                  }
                  // console.log(gridData)
                  datasheetTABLES.push(gridData)
                }
                // console.log(datasheetTABLES);
                this.setState({ sampleData: datasheetTABLES })
              }            

              if (lambdaData.body.kv && lambdaData.body.key_map) {            

                const FD = lambdaData.body.kv
                const KM = lambdaData.body.key_map

                const FDmap = Object.entries(FD)
                const KMmap = Object.entries(KM)

                var sortedForm = []
                
                FDmap.map(FDdata => {
                    KMmap.map(KMdata => {
                        if(FDdata[0] == KMdata[0]){
                            sortedForm.unshift({ 'Key': FDdata[1].Key, 'Value': FDdata[1].Value, 'Top': KMdata[1].Geometry.BoundingBox.Top, 'Left': KMdata[1].Geometry.BoundingBox.Left })           
                        }
                    })
                })   

                sortedForm.sort(function(a, b) {
                    return a.Top - b.Top;
                });
                // console.log(sortedForm)
                // console.log(JSON.stringify(sortedForm))
                
                var form = []
                sortedForm.map( SF => {             
                  var arr = [{value: SF.Key}, {value: SF.Value}]
                  form.push(arr)
                })

                const invoiceDate = this.findInvoiceDate(sortedForm, index)
                const invoiceNumber = this.findInvoiceNumber(sortedForm, index)
                const invoiceTotal = this.findInvoiceTotal(sortedForm, index)
                
                scannedFileData.push([{ value: invoiceNumber.Value }, { value: invoiceDate.Value }, { value: '' }, { value: invoiceTotal.SUBTOTAL.Value }, { value: invoiceTotal.VAT.Value }, { value: invoiceTotal.TOTAL.Value }])                
              
                this.setState({ formData: lambdaData.body.kv, keyMap: lambdaData.body.key_map, sortedForm: sortedForm, form: form, scannedFileData: scannedFileData })
              }
              this.prepareAllCSV()              
              this.deleteS3(targetImage)
            }

   
        } catch (error) {
          console.error(error)
          this.setState({ scanComplete: true, isScanning: false })
        }
        
    }   

    async getCurrentScanNumber(){
      const { unscannedFiles, scannedFiles, missingData, paymentID, scansExceeded } = this.state
      
      const teamRef = db.collection("teams").doc(paymentID);
      const doc = await teamRef.get()
      if (doc.exists) {
          console.log(doc.data());
          var scansCompleted = doc.data().ScansCompleted
          var maxNumberOfScans = doc.data().MaxNumberOfScans
          var availableScans = maxNumberOfScans - scansCompleted
          console.log(availableScans);

          if(availableScans < 1){ 
            console.log('Not enough scans');
            toaster.notify(`Not enough scans available. Available Scans: ${availableScans}`)
            this.setState({ scanComplete: true, isScanning: false, scansExceeded: true })  

            return false           
          } else {      
            this.setState({ scannedFiles: scannedFiles, unscannedFiles: unscannedFiles, scanComplete: false, isScanning: true })
            var increment = scansCompleted + 1
            teamRef.update({ ScansCompleted: increment });
            return true               
          }

      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          return false
      }
    }
    

    async beginScan() {
      const { unscannedFiles, scannedFiles, missingData, paymentID, scansExceeded } = this.state

      if(unscannedFiles.length < 1){
          console.log('No files detected');
          return
      }

      this.setState({ scanComplete: false, isScanning: true })
      console.log('Start Scan');
      for(var i=0; i < unscannedFiles.length; i++) {    
        var canScan = await this.getCurrentScanNumber() 
        if(canScan){
          await this.getFiles(unscannedFiles[i], i)
          scannedFiles.push(unscannedFiles[i])
          unscannedFiles[i].scanned = true
          this.setState({ scannedFiles: scannedFiles, unscannedFiles: unscannedFiles })
          this.updateUserScanNumber()
          this.updateSessionStorage()
        } else {
          console.log("Can't Scan");
        }
        
      }
      console.log('Scan Complete');
      if(missingData.length > 0) {
        this.setState({ scanComplete: true, isScanning: false, unscannedFiles: [], cornerDialog: true })
      } else {
        this.setState({ scanComplete: true, isScanning: false, unscannedFiles: [] })
      }  
      
    }

    prepareExcel(){
      const { scannedFileData, header } = this.state

      console.log(scannedFileData);
      console.log(header);

      var excel = []

      for(var i=0; i < scannedFileData.length; i++){          
        var arr = scannedFileData[i].map(row => {
          var value = Object.values(row)
          return value
        })
        var merged = [].concat.apply([], arr);
        excel.push(merged)
      }    

      for(var i=0; i < header.length; i++){          
        var arr = header[i].map(row => {
          var value = row.value
          return value
        })
        var merged = [].concat.apply([], arr);
        excel.unshift(merged)
      }
      console.log(excel);

      var ws = XLSX.utils.aoa_to_sheet(excel);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DATA");

      const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

      function s2ab(s) {
  
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
            
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'data.xlsx');

    }

    prepareAllCSV() {
      const { sampleData, form, xlsxData } = this.state
    

      for(var i=0; i < sampleData.length; i++){ 

          for(var j=0; j < sampleData[i].length; j++){          
          var arr = sampleData[i][j].map(row => {
              var value = Object.values(row)
              return value
          })
          var merged = [].concat.apply([], arr);
          xlsxData.push(merged)
          }   
      } 

      for(var i=0; i < form.length; i++){          
          var arr = form[i].map(row => {
          var value = Object.values(row)
          return value
          })
          var merged = [].concat.apply([], arr);
          xlsxData.push(merged)
      }       
      
      this.setState({ xlsxData: xlsxData })
      // console.log(xlsxData);
    }


    async readFiles(files){
      if(!files){
        return
      }
      const { unscannedFiles } = this.state
      for(var i=0; i<files.length; i++) {  

        var newFileData = {}
        const fileExt = files[i].file.name.split('.').pop();

        newFileData.fileName = files[i].file.name
        newFileData.fileExt = fileExt         
        newFileData.fileType = files[i].type 
        newFileData.scanned = false

        var base64String = files[i].base64.substr(files[i].base64.indexOf(',') + 1);
        newFileData.base64 = base64String

        unscannedFiles.push(newFileData)        
        
      }
      console.log(unscannedFiles);
      
      this.setState({ files: files, unscannedFiles: unscannedFiles })
    }


    async removeFile(index) {
      const { unscannedFiles } = this.state
      unscannedFiles.splice(index, 1);
      if(unscannedFiles.length === 0){
        this.myRef.current.children[0].value = null
      }
      this.setState({ unscannedFiles: unscannedFiles })
    }
    

    async shareData() {
      const { xlsxData } = this.state      

      var ws = XLSX.utils.aoa_to_sheet(xlsxData);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "DATA");

      const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

      function s2ab(s) {
  
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
            
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'data.xlsx');
     
    }

    setMissingData(fileName, Type, Data, scannedFileIndex){
      const { missingData, scannedFileData } = this.state 
      const index = _.findIndex(missingData, function(data) { return data.fileName == fileName });    
      if(index != -1){
        missingData[index][Type] = Data
      } else {
        let newMissingData = { scannedFileIndex: scannedFileIndex, fileName: fileName, [Type] : Data }
        missingData.push(newMissingData)
      }      
      this.setState({ missingData: missingData });
    }

    findInvoiceDate(sortedForm, index){
      const { unscannedFiles, missingData } = this.state

      // console.log(sortedForm);
      // console.log(index);
      var dateSearch = sortedForm.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes('DATE'))     

      if (dateSearch.length === 0){
        var invoiceDate = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'Date', [], index)
      }
      if (dateSearch.length === 1){
        var invoiceDate = dateSearch[0]
      }
      if (dateSearch.length > 1){
        var sampleIncludes = ['ISSUE', 'INVOICE']
        var includeVarsArr = []
        for(var i=0; i < sampleIncludes.length; i++){
          var loopTest = dateSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes(sampleIncludes[i]))               
          if(loopTest.length > 0){
            includeVarsArr.push(loopTest)
          }
          var multiDate = [].concat.apply([], includeVarsArr)
          multiDate = [...new Set(multiDate)]
        } 
        if(multiDate.length === 1){
          var invoiceDate = multiDate[0]
        } 
        if(multiDate.length > 1) {
          var invoiceDate = {Key: '', Value: ''}
          this.setMissingData(unscannedFiles[index].fileName, 'Date', multiDate, index)
        }
        if(multiDate.length === 0) {
          var onlyDate = dateSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase() === ('DATE'))
          if(onlyDate.length === 1){
            var invoiceDate = onlyDate[0]
          } else {
            var invoiceDate = {Key: '', Value: ''}
            this.setMissingData(unscannedFiles[index].fileName, 'Date', dateSearch, index)
          }          
        }
      }
      return invoiceDate
    }

    findInvoiceNumber(sortedForm, index){
      const { unscannedFiles, missingData } = this.state

      // console.log(sortedForm);
      // console.log(index);
      var invoiceSearch = sortedForm.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes('INVOICE') && !data.Key.replace(/\s/g, '').toUpperCase().includes('DATE'))

      if (invoiceSearch.length === 0){
        var invoiceNumber = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'InvoiceNumber', [], index)
      }
      if (invoiceSearch.length === 1){
        var invoiceNumber = invoiceSearch[0]
      }
      if (invoiceSearch.length > 1){
        var sampleIncludes = ['NO.', 'NO', 'NO:', 'NUMBER']
        var includeVarsArr = []
        for(var i=0; i < sampleIncludes.length; i++){
          var loopTest = invoiceSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes(sampleIncludes[i]))               
          if(loopTest.length > 0){
            includeVarsArr.push(loopTest)
          }
          var multiInvoice = [].concat.apply([], includeVarsArr)
          multiInvoice = [...new Set(multiInvoice)]
        } 
        if(multiInvoice.length === 1){
          var invoiceNumber = multiInvoice[0]
        } 
        if(multiInvoice.length > 1) {
          var invoiceNumber = {Key: '', Value: ''}
          this.setMissingData(unscannedFiles[index].fileName, 'InvoiceNumber', multiInvoice, index)
        }
        if(multiInvoice.length === 0) {
          var onlyInvoiceNumber = invoiceSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase() === ('INVOICE'))
          if(onlyInvoiceNumber.length === 1){
            var invoiceNumber = onlyInvoiceNumber[0]
          } else {
            var invoiceNumber = {Key: '', Value: ''}
            this.setMissingData(unscannedFiles[index].fileName, 'InvoiceNumber', invoiceSearch, index)
          }
        }
      }
      return invoiceNumber
    }

    findInvoiceTotal(sortedForm, index){
      const { unscannedFiles, missingData } = this.state

      // console.log(sortedForm);
      // console.log(index);

      var vatSearch = sortedForm.filter(data => /\d/.test(JSON.stringify(data.Value).replace(/\s/g, '')) && JSON.stringify(data.Value).replace(/\s/g, '').includes('.') && !/[a-zA-Z]/.test(JSON.stringify(data.Value).replace(/\s/g, '')))
      // console.log(vatSearch);
    
      var sampleIncludes = ['V.A.T.', 'V.A.T', 'TAX', 'VAT']
      var includeVarsArr = []
      for(var i=0; i < sampleIncludes.length; i++){
        var loopTest = vatSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes(sampleIncludes[i]))               
        if(loopTest.length > 0){
          includeVarsArr.push(loopTest)
        }
        var multiVAT = [].concat.apply([], includeVarsArr)
        multiVAT = [...new Set(multiVAT)]
      } 
      if(multiVAT.length === 1){
        var invoiceVAT = multiVAT[0]
      } 
      if(multiVAT.length > 1) {
        var invoiceVAT = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'VAT', multiVAT, index)
      }
      if(multiVAT.length === 0) {
        var invoiceVAT = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'VAT', vatSearch, index)
      }

      var sampleIncludes = ['TOTAL', 'AMOUNT', 'DUE', 'BALANCE', 'OWE', 'GOODS']
      var includeVarsArr = []
      for(var i=0; i < sampleIncludes.length; i++){
        var loopTest = vatSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes(sampleIncludes[i]) && !data.Key.replace(/\s/g, '').toUpperCase().includes('SUB') && !data.Key.replace(/\s/g, '').toUpperCase().includes('DATE'))               
        if(loopTest.length > 0){
          includeVarsArr.push(loopTest)
        }
        var multiTOTAL = [].concat.apply([], includeVarsArr)
        multiTOTAL = [...new Set(multiTOTAL)]        
      }         
      
      if(multiTOTAL.length === 1){
        var invoiceTOTAL = multiTOTAL[0]
      } 
      if(multiTOTAL.length > 1) {

        function checkValue(data) {
          return parseFloat(JSON.stringify(data.Value).replace(/[^\d\.]/g, "")) === parseFloat(JSON.stringify(multiTOTAL[0].Value).replace(/[^\d\.]/g, ""))
        }
        if(multiTOTAL.every(checkValue)){          
          var invoiceTOTAL = {Key: 'Total', Value: parseFloat(JSON.stringify(multiTOTAL[0].Value).replace(/[^\d\.]/g, "")).toFixed(2)}
        } else {
          var invoiceTOTAL = {Key: '', Value: ''}
          this.setMissingData(unscannedFiles[index].fileName, 'Total', multiTOTAL, index)
        }
      }
      if(multiTOTAL.length === 0) {
        var invoiceTOTAL = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'Total', vatSearch, index)
      }

      var sampleIncludes = ['SUB', 'GROSS']
      var includeVarsArr = []
      for(var i=0; i < sampleIncludes.length; i++){
        var loopTest = vatSearch.filter(data => data.Key.replace(/\s/g, '').toUpperCase().includes(sampleIncludes[i]))               
        if(loopTest.length > 0){
          includeVarsArr.push(loopTest)
        }
        var multiSUBTOTAL = [].concat.apply([], includeVarsArr)
        multiSUBTOTAL = [...new Set(multiSUBTOTAL)]
      } 
      // console.log(multiSUBTOTAL);
      if(multiSUBTOTAL.length === 1){
        var invoiceSUBTOTAL = multiSUBTOTAL[0]
      } 
      if(multiSUBTOTAL.length > 1) {
        var invoiceSUBTOTAL = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'Subtotal', multiSUBTOTAL, index)
      }
      if(multiSUBTOTAL.length === 0) {
        var invoiceSUBTOTAL = {Key: '', Value: ''}
        this.setMissingData(unscannedFiles[index].fileName, 'Subtotal', vatSearch, index)
      }

      if(invoiceVAT.Value != '' && invoiceTOTAL.Value === '' && invoiceSUBTOTAL.Value != ''){
        var vatNumber = parseFloat(JSON.stringify(invoiceVAT.Value).replace(/[^\d\.]/g, ""));
        var subtotalNumber = parseFloat(JSON.stringify(invoiceSUBTOTAL).replace(/[^\d\.]/g, ""));
        var tempTotalNumber = vatNumber + subtotalNumber
        for(var i=0; i < multiTOTAL.length; i++){
          if(parseFloat(JSON.stringify(multiTOTAL[i].Value).replace(/[^\d\.]/g, "")) === tempTotalNumber){
            var invoiceTOTAL = multiTOTAL[i]
          }
        }

      }
     
      if(invoiceVAT.Value != '' && invoiceTOTAL.Value != '' && invoiceSUBTOTAL.Value === ''){
        var vatNumber = parseFloat(JSON.stringify(invoiceVAT.Value).replace(/[^\d\.]/g, ""));
        var totalNumber = parseFloat(JSON.stringify(invoiceTOTAL).replace(/[^\d\.]/g, ""));
        invoiceSUBTOTAL = {Key: 'Subtotal', Value: totalNumber - vatNumber  }  
      }

      var allInvoiceNumbers = { VAT: invoiceVAT, TOTAL: invoiceTOTAL, SUBTOTAL: invoiceSUBTOTAL }
      return allInvoiceNumbers
    }

    updateUserScanNumber(){
      const { userToken, paymentID } = this.state
      const increment = firebase.firestore.FieldValue.increment(1);
      const userRef = db.collection("users").doc(userToken);
      userRef.update({ NoOfScans: increment });  
    }

    refresh(){
        this.myRef.current.children[0].value = null
        this.setState({ xlsxData: [], unscannedFiles: [], scannedFiles: [], missingData: [], scannedFileData: [] })
        sessionStorage.setItem('invoiceScannedFiles', [])
        sessionStorage.setItem('invoiceScannedFileData', [])
        sessionStorage.setItem('invoiceMissingData', [])
        sessionStorage.setItem('invoiceXlsxData', [])
    }


    deleteS3(targetImage){
      var s3 = new AWS.S3();
      var params = {  Bucket: process.env.REACT_APP_S3_BUCKET, Key: targetImage };

      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log();                 // deleted
      });
    }

    updateSessionStorage(){
      const { scannedFiles, scannedFileData, missingData, xlsxData } = this.state

      sessionStorage.setItem('invoiceScannedFiles', JSON.stringify(scannedFiles))
      sessionStorage.setItem('invoiceScannedFileData', JSON.stringify(scannedFileData))
      sessionStorage.setItem('invoiceMissingData', JSON.stringify(missingData))
      sessionStorage.setItem('invoiceXlsxData', JSON.stringify(xlsxData))
    }

    
    render() { 
        const { pageLoaded, isLoggedIn, redirect, progressBar, messages, appVersion, cornerDialog, sampleScannedFileData, sampleMissingData, missingDataDialog, missingData, scannedFileData, unscannedFiles, scannedFiles, fileExt, xlsxData, array, csv, formData, keyMap, sampleData, imageDataURL, sortedForm, form, scanComplete, isScanning } = this.state  
        
        if(pageLoaded){
          if(!isLoggedIn){
            return (
              <Redirect to={redirect} />
            )
          }
        }

        return ( 
            <div>

                <div className='grid md:grid-cols-12 ml-56'>

                <div className="md:col-span-12">    

                    <Pane padding='40px' paddingTop={10} justifyContent='center' alignItems='center'>    

                      <div>                      
                      
                      <Heading size={900} marginBottom={50}>Invoice Scanner</Heading>

                      <Form onSubmit={this.handleSubmit}>
                        <FormGroup>                 

                            <div className="flex text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>

                            <div ref= {this.myRef} className="files border-2 border-gray-300 border-dashed rounded-md -mt-14">
                                <FileBase64                                     
                                    multiple={true}
                                    onDone={this.readFiles.bind(this)}
                                />
                            </div>
                        </FormGroup>
                      </Form>                     


                      <Pane display='flex' justifyContent='center' marginTop={10}>
                        {
                          !isScanning ?
                          <Pane display='flex' flexDirection='row'> 
                            <Button marginRight={50} intent='none' appearance="primary" onClick={() => this.beginScan()}>Scan</Button>   
                            
                            <Button intent='danger' appearance="primary" onClick={() => this.refresh()}>Clear All Data</Button>                                 
                          </Pane>
                          :
                          <Pane flex={1} alignItems="center" display="flex" justifyContent='center'>
                            <Spinner/>
                          </Pane>
                        } 
                        
                      </Pane>

              
                      <Pane margin='auto' paddingBottom='50px' display='flex' flexDirection='row'>
                        <Pane width='50%' display='flex' flexDirection='column' padding={20}>
                          <Heading size={700}>Unscanned Files</Heading>
                          
                          <Table>
                            <Table.Head>
                              <Table.TextHeaderCell>File Name</Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body minHeight={64}>
                              {unscannedFiles.length > 0 &&
                                <Fragment>
                                  {
                                    unscannedFiles.map((file,index) => (  
                                          <Table.Row key={index} file={file}>
                                            <Table.TextCell>{file.fileName}</Table.TextCell>
                                            {/* <Table.TextCell>{file.scanned == false ? 'Not Scanned' : 'Scanned'}</Table.TextCell> */}
                                            {
                                              !isScanning &&
                                              <Button intent='danger' appearance="primary" margin='auto' marginRight='50px' onClick={() => this.removeFile(index)}>Remove</Button>
                                            }                                            
                                          </Table.Row>                             
                                    ))
                                  }
                                </Fragment>
                              }
                            </Table.Body>
                          </Table>  
                          
                        </Pane>
                        <Pane width='50%' display='flex' flexDirection='column' padding={20}>
                          <Heading size={700}>Scanned Files</Heading>                          
                          <Table>
                            <Table.Head>
                              <Table.TextHeaderCell>File Name</Table.TextHeaderCell>
                            </Table.Head>
                            <Table.Body minHeight={64}>
                            {scannedFiles.length > 0 &&
                              <Fragment>
                                {
                                  scannedFiles.map((file,index) => (  
                                        <Table.Row key={index} file={file}>
                                          <Table.TextCell>{file.fileName}</Table.TextCell>
                                        </Table.Row>                             
                                  ))
                                }
                              </Fragment>
                            }
                            </Table.Body>
                          </Table>  
                          
                        </Pane>
                      </Pane>   

                      <Pane display='flex' justifyContent='center' marginBottom={10}>
                        {
                          missingData.length > 0 &&
                            <Button marginRight={30} onClick={() => this.setState({ missingDataDialog: true })} appearance="primary">Find Missing Data</Button> 
                        }              
                        {
                          scannedFileData.length > 0 &&
                            <Button intent='success' appearance="primary" onClick={() => this.prepareExcel()} marginRight={20}>Convert to EXCEL</Button>  
                        }        
                        
                      </Pane>  

                      </div>         

                      <div className='w-full h-full'>
                      <div className='overflow-auto p-2'>
                      <ReactDataSheet
                        data={this.state.header}
                        valueRenderer={cell => { cell.readOnly = true; return cell.value; }}                                      
                      />
                      {
                        scannedFileData.length > 0 ?
                          <ReactDataSheet
                            data={this.state.scannedFileData}
                            valueRenderer={cell => cell.value}
                            onCellsChanged={changes => {
                              const scannedFileData = this.state.scannedFileData.map(row => [...row]);
                              changes.forEach(({ cell, row, col, value }) => {
                                scannedFileData[row][col] = { ...scannedFileData[row][col], value };
                              });
                              this.setState({ scannedFileData }, () => this.updateSessionStorage()); 
                            }}                        
                          />
                          :
                          <ReactDataSheet
                            data={this.state.grid}
                            valueRenderer={cell => cell.value}
                            onCellsChanged={changes => {
                              const grid = this.state.grid.map(row => [...row]);
                              changes.forEach(({ cell, row, col, value }) => {
                                grid[row][col] = { ...grid[row][col], value };
                              });
                              this.setState({ grid });
                            }}                        
                          />
                      }     

                      </div>
                      </div>   


                    </Pane>
                    
                    {
                      scanComplete &&                    

                        <Dialog
                          isShown={missingDataDialog}
                          title="Missing Data"
                          onCloseComplete={() => this.setState({ missingDataDialog: false })}
                          hasFooter={false}
                          preventBodyScrolling
                          width='60%'
                        >
                          {
                            missingData.map(((data,index) => ( 
                                <Pane marginBottom={20} key={index} data={data}>
                                  <Pane display='flex' flexDirection='row' marginBottom={10}>
                                    <Heading size={500} marginRight={10}>Filename:</Heading>
                                    <Heading size={500}>{data.fileName.toUpperCase()}</Heading>
                                  </Pane>
                                  {
                                    data.InvoiceNumber &&
                                    <Fragment>
                                      <Heading size={500}>Invoice Number:</Heading>
                                      <Pane display='flex' flexDirection='row'>
                                        <Pane marginRight={30}>
                                          <SelectMenu
                                            title="Invoice Number"
                                            options={data.InvoiceNumber.map((data) => ({ label: `${data.Key} --- ${data.Value}`, value: data }))}
                                            // selected={selected}
                                            onSelect={(item) => {scannedFileData[data.scannedFileIndex][0].value = item.value.Value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}
                                            closeOnSelect
                                            hasFilter={false}
                                            position={Position.BOTTOM_LEFT}
                                            emptyView={
                                              <Pane height="100%" display="flex" alignItems="center" justifyContent="center">
                                                <Text size={300}>NO OPTIONS FOUND</Text>
                                              </Pane>
                                            }
                                          >
                                            <Button>{'Select Invoice Number...'}</Button>
                                          </SelectMenu> 
                                        </Pane>     
                                        <Pane display='flex' justifyContent='flex-end'>                             
                                          <TextInput name="text-input-name" placeholder="Invoice Number" value={scannedFileData[data.scannedFileIndex][0].value} onChange={e => {scannedFileData[data.scannedFileIndex][0].value = e.target.value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}} />
                                        </Pane>
                                      </Pane>                                    
                                    </Fragment>
                                  }
                                  {
                                    data.Date &&
                                    <Fragment>
                                    <Heading size={500}>Invoice Date:</Heading>
                                      <Pane display='flex' flexDirection='row'>
                                        <Pane marginRight={30}>
                                          <SelectMenu
                                            title="Invoice Date"
                                            options={data.Date.map((data) => ({ label: `${data.Key} --- ${data.Value}`, value: data }))}
                                            // selected={selected}
                                            onSelect={(item) => {scannedFileData[data.scannedFileIndex][1].value = item.value.Value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}
                                            closeOnSelect
                                            hasFilter={false}
                                            position={Position.BOTTOM_LEFT}
                                            emptyView={
                                              <Pane height="100%" display="flex" alignItems="center" justifyContent="center">
                                                <Text size={300}>NO OPTIONS FOUND</Text>
                                              </Pane>
                                            }
                                          >
                                            <Button>{'Select Invoice Date...'}</Button>
                                          </SelectMenu> 
                                        </Pane>     
                                        <Pane display='flex' justifyContent='flex-end'>                             
                                          <TextInput name="text-input-name" placeholder="Date" value={scannedFileData[data.scannedFileIndex][1].value} onChange={e => {scannedFileData[data.scannedFileIndex][1].value = e.target.value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}/>
                                        </Pane>
                                      </Pane>                                      
                                    </Fragment>
                                  }
                                  {
                                    data.Subtotal &&
                                    <Fragment>
                                      <Heading size={500}>Subtotal:</Heading>
                                      <Pane display='flex' flexDirection='row'>
                                        <Pane marginRight={30}>
                                          <SelectMenu
                                            title="Subtotal"
                                            options={data.Subtotal.map((data) => ({ label: `${data.Key} --- ${data.Value}`, value: data }))}
                                            // selected={selected}
                                            onSelect={(item) => {scannedFileData[data.scannedFileIndex][3].value = item.value.Value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}
                                            closeOnSelect
                                            hasFilter={false}
                                            position={Position.BOTTOM_LEFT}
                                            emptyView={
                                              <Pane height="100%" display="flex" alignItems="center" justifyContent="center">
                                                <Text size={300}>NO OPTIONS FOUND</Text>
                                              </Pane>
                                            }
                                          >
                                            <Button>{'Select Subtotal...'}</Button>
                                          </SelectMenu> 
                                        </Pane>     
                                        <Pane display='flex' justifyContent='flex-end'>                         
                                          <TextInput name="text-input-name" placeholder="Subtotal" value={scannedFileData[data.scannedFileIndex][3].value} onChange={e => {scannedFileData[data.scannedFileIndex][3].value = e.target.value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}} />
                                        </Pane>                                        
                                      </Pane>
                                    </Fragment>
                                  }
                                  {
                                    data.VAT &&
                                    <Fragment>
                                    <Heading size={500}>VAT:</Heading>
                                      <Pane display='flex' flexDirection='row'>
                                        <Pane marginRight={30}>
                                          <SelectMenu
                                            title="VAT"
                                            options={data.VAT.map((data) => ({ label: `${data.Key} --- ${data.Value}`, value: data }))}
                                            // selected={selected}
                                            onSelect={(item) => {scannedFileData[data.scannedFileIndex][4].value = item.value.Value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}
                                            closeOnSelect
                                            hasFilter={false}
                                            position={Position.BOTTOM_LEFT}
                                            emptyView={
                                              <Pane height="100%" display="flex" alignItems="center" justifyContent="center">
                                                <Text size={300}>NO OPTIONS FOUND</Text>
                                              </Pane>
                                            }
                                          >
                                            <Button>{'Select VAT...'}</Button>
                                          </SelectMenu> 
                                        </Pane>          
                                        <Pane display='flex' justifyContent='flex-end'>                        
                                          <TextInput name="text-input-name" placeholder="VAT" value={scannedFileData[data.scannedFileIndex][4].value} onChange={e => {scannedFileData[data.scannedFileIndex][4].value = e.target.value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}/>
                                        </Pane>
                                      </Pane>                                    
                                    </Fragment>
                                  }
                                  {
                                    data.Total &&
                                    <Fragment>
                                    <Heading size={500}>Total:</Heading>
                                      <Pane display='flex' flexDirection='row'>
                                        <Pane marginRight={30}>
                                          <SelectMenu
                                            title="Total"
                                            options={data.Total.map((data) => ({ label: `${data.Key} --- ${data.Value}`, value: data }))}
                                            // selected={selected}
                                            onSelect={(item) => {scannedFileData[data.scannedFileIndex][5].value = item.value.Value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}
                                            closeOnSelect
                                            hasFilter={false}
                                            position={Position.BOTTOM_LEFT}
                                            emptyView={
                                              <Pane height="100%" display="flex" alignItems="center" justifyContent="center">
                                                <Text size={300}>NO OPTIONS FOUND</Text>
                                              </Pane>
                                            }
                                          >
                                            <Button>{'Select Total...'}</Button>
                                          </SelectMenu> 
                                        </Pane>    
                                        <Pane display='flex' justifyContent='flex-end'>                            
                                          <TextInput name="text-input-name" placeholder="Total" value={scannedFileData[data.scannedFileIndex][5].value} onChange={e => {scannedFileData[data.scannedFileIndex][5].value = e.target.value; this.setState({ scannedFileData: scannedFileData }, () => this.updateSessionStorage())}}/>
                                        </Pane>
                                      </Pane>                                     
                                    </Fragment>
                                  }
                                </Pane>
                            ))) 
                          }
                          <Button display='flex' margin='auto' marginTop={30} marginBottom={30} onClick={() => this.setState({ missingDataDialog: false })} appearance="primary">Complete</Button>
                        </Dialog>                          
                    }
                    <CornerDialog
                      title="Missing Data"
                      isShown={cornerDialog}
                      onCloseComplete={() =>this.setState({ cornerDialog: false })}
                      hasFooter={false}
                    >
                      Some data could not be found or verifed.
                      <Pane display='flex' flexDirection='row' justifyContent='flex-end' paddingTop={20}>
                        <Button marginRight={20} onClick={() => this.setState({ cornerDialog: false })} >Close</Button>
                        <Button onClick={() => this.setState({ cornerDialog: false, missingDataDialog: true })} appearance="primary">Verify Missing Data</Button>
                      </Pane>
                    </CornerDialog>
                </div>
                </div>
            </div>
         );
    }
}
 
export default Invoice;