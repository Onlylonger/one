import { BrowserView, BrowserWindow, ipcMain, screen } from 'electron';
import { join } from 'node:path';
import { isDev } from '../utils';
import { IPC_CHANNEL } from '../contant';

// const defaultUrl = 'https://www.electronjs.org/';
const defaultUrl = 'https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe';

export default class ExternalView {
  win: BrowserWindow | null;
  view: BrowserView | null;

  constructor(window: BrowserWindow) {
    this.win = window;
    this.init();
  }

  sendDidNavigateInPage(url: string) {
    if (this.win) {
      this.win.webContents.send(IPC_CHANNEL.DidNavigateInPage, {
        url,
      });
    }
  }

  init() {
    this.view = new BrowserView({
      webPreferences: {
        enablePreferredSizeMode: true,
        devTools: isDev,
      },
    });
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    this.win.setBrowserView(this.view);

    this.view.setBounds({ x: 0, y: 120, width: width, height: height - 120 });
    this.view.webContents.loadURL(defaultUrl);
    if (isDev) {
      this.view.webContents.openDevTools();
    }

    this.view.webContents.setWindowOpenHandler(({ url }) => {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        },
      };
    });

    this.view.webContents.on(IPC_CHANNEL.DidNavigateInPage, (_, url) => {
      this.sendDidNavigateInPage(url);
    });
    this.win.webContents.on('dom-ready', () => {
      this.sendDidNavigateInPage(defaultUrl);
    });

    ipcMain.on('update-url', (_, data) => {
      // this.view.webContents.loadURL(data.url);
    });

    ipcMain.on('back', (_, data) => {
      console.log('receive');
      //   mainWin.setAlwaysOnTop(true, 'pop-up-menu', 1);

      // mainWin.
      // this.view.webContents.loadURL(data.url);
    });
  }
}
