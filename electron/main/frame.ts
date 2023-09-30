import { BrowserWindow } from 'electron';

export default class Frame {
  win: BrowserWindow | null;

  constructor(window: BrowserWindow) {
    this.win = window;
    this.init();
  }

  init() {
    this.win.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (detail, cb) => {
      Object.keys(detail.responseHeaders).forEach((field) => {
        if (field.includes('frame') || field.includes('Frame')) {
          delete detail.responseHeaders[field];
        }
      });
      if (detail.responseHeaders['Content-Security-Policy']) {
        // detail.responseHeaders['Content-Security-Policy'] = [`${detail.responseHeaders['Content-Security-Policy'][0]} ${url};`];
        detail.responseHeaders['Content-Security-Policy'] = [
          "frame-ancestors 'self' https://chat.baidu.com http://mirror-chat.baidu.com https://fj-chat.baidu.com https://hba-chat.baidu.com https://hbe-chat.baidu.com https://njjs-chat.baidu.com https://nj-chat.baidu.com https://hna-chat.baidu.com https://hnb-chat.baidu.com http://debug.baidu-int.com http://localhost:5173/;",
        ];
        // console.log(detail.responseHeaders['Content-Security-Policy']);
      }
      // if (detail.responseHeaders['X-Frame-Options']) {
      //   delete detail.responseHeaders['X-Frame-Options'];
      // } else if (detail.responseHeaders['X-frame-Options']) {
      //   delete detail.responseHeaders['X-frame-Options'];
      // }
      // console.log('detail', detail.url, detail.responseHeaders);
      cb({
        cancel: false,
        responseHeaders: detail.responseHeaders,
      });
    });
  }
}
