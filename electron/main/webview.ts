import { BrowserWindow, ipcMain, webContents } from 'electron';
import { IPC_CHANNEL } from '../contant';

export default class WebView {
  win: BrowserWindow | null;

  constructor(window: BrowserWindow) {
    this.win = window;

    ipcMain.on(IPC_CHANNEL.SendWebViewContentId, (event, data) => {
      const { id } = data;
      const guest = this.getGuestForWebContents(id, event.sender);
      guest.setWindowOpenHandler(({ url }) => {
        this.win.webContents.send(IPC_CHANNEL.OpenWindow, { url });
        return { action: 'deny' };
      });
    });
  }

  getGuestForWebContents(webContentsId: number, contents: Electron.WebContents) {
    const guest = webContents.fromId(webContentsId);
    if (!guest) {
      throw new Error(`Invalid webContentsId: ${webContentsId}`);
    }
    if (guest.hostWebContents !== contents) {
      throw new Error('Access denied to webContents');
    }
    return guest;
  }
}
