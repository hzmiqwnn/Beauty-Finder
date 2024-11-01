const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

let mainWindow;


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  
  mainWindow = new BrowserWindow({
    fullscreen:true,
    frame:false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools:false,
    },
  });

  
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  
  mainWindow.setMenu(null);

  
  mainWindow.webContents.openDevTools();
};


app.whenReady().then(() => {
  createWindow();

  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


ipcMain.on('quit-app', () => {
  app.quit();
});

