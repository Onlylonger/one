import { BrowserWindow, ipcMain, webContents } from 'electron';
import { IPC_CHANNEL } from '../contant';

export default class WebView {
  win: BrowserWindow | null;

  constructor(window: BrowserWindow) {
    this.win = window;
    console.log('----------');
    ipcMain.on(IPC_CHANNEL.SendWebViewContentId, (event, data) => {
      const { id, url } = data;
      const hostAjaxDataMap = {
        pageUrl: url,
        info: {},
      };
      const guest = this.getGuestForWebContents(id, event.sender);
      guest.setWindowOpenHandler(({ url }) => {
        this.win.webContents.send(IPC_CHANNEL.OpenWindow, { url });
        return { action: 'deny' };
      });
      try {
        guest.debugger.attach('1.3');
      } catch (err) {
        console.log('Debugger attach failed: ', err);
      }

      guest.debugger.on('detach', (event, reason) => {
        console.log('Debugger detached due to: ', reason);
      });

      guest.debugger.on('message', (event, method, params) => {
        if (method === 'Network.responseReceived') {
          //params中无响应数据只有响应头
          var mimeType = params.response.mimeType;
          if (mimeType != 'image/gif' && mimeType != 'image/jpeg' && mimeType == 'application/json') {
            // console.log(params);
            guest.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then((response) => {
              hostAjaxDataMap.info = {
                ...hostAjaxDataMap.info,
                [params.response.url]: JSON.parse(response.body),
              };
              this.win.webContents.send(IPC_CHANNEL.GetPageNetWorkResponseBody, hostAjaxDataMap);
              // console.log(response);
              // guest.send('log', params.response.url, JSON.parse(response.body));
              // webContents.fromId(2).send("log",params.response.url,JSON.parse(response.body))
            });
          }

          // guest.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function (response) {
          //   // console.log(response);
          // });
        }
      });

      guest.debugger.sendCommand('Network.enable');
      // guest.on('resp');
      // guest.session.webRequest.onCompleted()
      // guest.session.webRequest.onResponseStarted(
      //   {
      //     urls: ['*://*/api/*', '*://*/front/*'],
      //   },
      //   (details) => {
      //     console.log(details.url);
      //     // details.requestHeaders['User-Agent'] = 'MyAgent'
      //     // callback({ requestHeaders: details.requestHeaders });
      //   }
      // );
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
