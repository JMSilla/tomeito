const electron = require('electron')
const url = require("url");
const path = require("path");
  
let appWindow

function initWindow() {
  var screenElectron = electron.screen
  var mainScreen = screenElectron.getPrimaryDisplay()
  var dimensions = mainScreen.size
  var width = Math.round(dimensions.width * 0.14)
  var height = Math.round(dimensions.height * 0.15)

  const nativeImage = electron.nativeImage;
  var image = nativeImage.createFromPath('src/assets/icons/tomato.png'); 
  image.setTemplateImage(true);

  appWindow = new electron.BrowserWindow({
    width: width,
    height: height,
    x: dimensions.width - width,
    y: dimensions.height - height,
    frame: false,
    icon: image,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false
    }
  })

  appWindow.setMenu(null)
  appWindow.setAlwaysOnTop(true, 'screen')
  appWindow.setResizable(false)
  
  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  )
  
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

electron.ipcMain.on('resize-config', function() {
  resizeWindow(0.25, 0.25)
})

electron.ipcMain.on('resize-tomeito', function() {
  resizeWindow(0.14, 0.15)
})

function resizeWindow(widthPct, heightPct) {
  var screenElectron = electron.screen
  var mainScreen = screenElectron.getPrimaryDisplay()
  var dimensions = mainScreen.size
  var width = Math.round(dimensions.width * widthPct)
  var height = Math.round(dimensions.height * heightPct)

  appWindow.setResizable(true)
  appWindow.setSize(width,height)
  appWindow.setResizable(false)
}