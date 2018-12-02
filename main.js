// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { ipcMain, dialog } = require('electron')
const path = require('path')
const { Menu, Tray } = require('electron')
// const isRoot = require('is-root');
var cracker = require('./cracker.js')



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon = null




function add_icon_to_tray() {
  var iconPath = path.join(__dirname, "images", 'appIcon.png')
  console.log(iconPath)
  appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Remove',
    click: () => { console.log("remove") }
  }])

  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)

}



// function checking_root(){
//   console.log(isRoot())
//   if (!isRoot()) {
//     dialog.showErrorBox('Not ROOT', "This app needs super user privs to work!")
//   }

// }




function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 600, height: 240 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  // checking_root();
  cracker.adjust_permissions();



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q

 //removing icon from tray
  if (appIcon) appIcon.destroy()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
    add_icon_to_tray()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


process.on('uncaughtException', function (error) {
  console.log("UNCATCH EXCEPTION FOUND ")
  console.log(error)
})





//dialog
ipcMain.on('open-dialog', (event, target) => {
  const options = {
    type: 'info',
    title: 'Confirmation',
    message: 'Do you want to crack ' + target + ' ?',
    buttons: ['Yes', 'no']
  }
  dialog.showMessageBox(options, (index) => {
    event.sender.send('capture-result', index)
  })
})




// handle cracking requests
ipcMain.on('crack-photoshop', (event) => {
   console.log('crack-photoshop')
   result = cracker.crack_photoshop();
   event.sender.send('crack-result', result)
})

ipcMain.on('crack-illustrator', (event) => {
  console.log('crack-illustrator')
  result = cracker.crack_illustrator();
  event.sender.send('crack-result', result)
})

ipcMain.on('crack-sketch', (event) => {
  console.log('crack-sketch')
})















