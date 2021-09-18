// Import Modules
const { MSICreator } = require('electron-wix-msi')
const path = require('path')

// Define input and output directory
const APP_DIR = path.resolve(__dirname, './dist');
const OUT_DIR = path.resolve(__dirname, './windows_installer');

// Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure Metadata 
    description: 'InvoSyncApplication',
    exe: 'InvoSyncSetup0.1.7',
    name: 'InvoSyncDesktopApplication',
    version: '0.1.7',

    // Configure installer user interface
    ui: {
        chooseDirectory: true
    },
});

// Create a .wxs template file
msiCreator.create().then(function(){
    // Compile the template to a .msi file
    msiCreator.compile();
});