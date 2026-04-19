const { app, BrowserWindow } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('http://localhost:5173/admin/tickets');
}

app.whenReady().then( createWindow);