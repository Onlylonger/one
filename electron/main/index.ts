import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import AppUpdater from '../updater';
import '../logger';
import { isDev } from '../utils';
import { IPC_CHANNEL } from '../contant';
import WebView from './webview';

process.env.DIST_ELECTRON = join(__dirname, '..');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;
process.env.DIST_WEBVIEW_PRELOAD = join(process.env.DIST_ELECTRON, './preload/webview.js');

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWin: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');
console.log(url, indexHtml);
const commonWebPreferences = {
  nodeIntegration: false,
  contextIsolation: true,
};

Menu.setApplicationMenu(null);

async function createWindow() {
  mainWin = new BrowserWindow({
    title: 'OnePick一键采集',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      ...commonWebPreferences,
      webviewTag: true,
    },
  });

  mainWin.maximize();

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    mainWin.loadURL(url);
    // Open devTool if the app is not packaged
    mainWin.webContents.openDevTools();
  } else {
    mainWin.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  mainWin.webContents.on('did-finish-load', () => {
    mainWin?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    console.log(url);
    mainWin.webContents.send(IPC_CHANNEL.OpenWindow, { url });
    // if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // new AppUpdater();
  new WebView(mainWin);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  mainWin = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (mainWin) {
    // Focus on the main window if the user tried to open another
    if (mainWin.isMinimized()) mainWin.restore();
    mainWin.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-mainWin', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      ...commonWebPreferences,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on('ceshi', (_, data) => {
  console.log(_, data);
});
