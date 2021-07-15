const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const { autoUpdater } = require("electron-updater")
const isDev = require('electron-is-dev');
const path = require('path');
const log = require('electron-log');


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

/**
 * createWindow - Creates the initial browser window for the app.
 * @return {null}
 */
function createWindow() {

    // create the browser window, with the specified settings/options
    // learn more about BrowserWindow in official electron api
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        },
        frame: true,
        show: false
    });

    // set the view for the window, by either going to localhost:3000
    // or if in production, grabbing the build file
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    
    // once the window is ready show it
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    // when renderer sends closeApp to to main, exit the process.
    ipcMain.on('closeApp', e => {
        console.log('Got called to close the app')
        e.preventDefault();
        process.exit();
    });

}

setInterval(() => {
  autoUpdater.checkForUpdatesAndNotify();
  console.log('checking');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())
  })
}, 60000)

// once electron app is ready, createWindow
app.on('ready', () => {
  
  createWindow()

  autoUpdater.checkForUpdatesAndNotify();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('version', app.getVersion())
  })

})

ipcMain.on('test', (event, arg) => {
  console.log('here 001', arg);
  mainWindow.send('test-back', 'pong')
})

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
})
// autoUpdater.on('error', (err) => {
//   console.log('Error in auto-updater. ' + err);
// })
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
})
// autoUpdater.on('update-downloaded', (info) => {
//   console.log('Update downloaded');
// });