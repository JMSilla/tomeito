const electron = require('electron')
const url = require("url");
const path = require("path");
  
let appWindow

function initWindow() {
  var screenElectron = electron.screen
  var mainScreen = screenElectron.getPrimaryDisplay()
  var dimensions = mainScreen.size
  var width = Math.round(dimensions.width * 0.10)
  var height = Math.round(dimensions.height * 0.13)

  appWindow = new electron.BrowserWindow({
    width: width,
    height: height,
    x: dimensions.width - width,
    y: dimensions.height - height,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  appWindow.setMenu(null)
  appWindow.setAlwaysOnTop(true, 'screen')

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // Initialize the DevTools.
  // appWindow.webContents.openDevTools()

  appWindow.on('closed', function () {
    appWindow = null
  })
}

electron.app.on('ready', initWindow)

// Close when all windows are closed.
electron.app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    electron.app.quit()
  }
})

electron.app.on('activate', function () {
  if (electron.win === null) {
    initWindow()
  }
})