import { contextBridge, ipcRenderer } from 'electron';
import { version } from '../utils';
import { IPC_CHANNEL } from '../contant';

const ipc = {
  render: {
    // 主进程发出的通知
    send: ['checkForUpdate', 'checkAppVersion', 'update-url', 'back', IPC_CHANNEL.SendWebViewContentId],
    // 渲染进程发出的通知
    receive: ['version', 'downloadProgress', IPC_CHANNEL.DidNavigateInPage, IPC_CHANNEL.OpenWindow],
  },
};

const electronHandler = {
  packageInfo: {
    version,
  },
  ipcRender: {
    // 主进程发送通知给渲染进程
    send: (channel: string, data?: Record<string, any>) => {
      // const validChannels = ipc.render.send;
      // if (validChannels.includes(channel)) {
      console.log(channel, data);
      ipcRenderer.send(channel, data);
      // }
    },
    // 渲染进程监听到主进程发来的通知，执行相关的操作
    receive: (channel: string, func: any) => {
      // const validChannels = ipc.render.receive;
      // if (validChannels.includes(channel)) {
      ipcRenderer.on(`${channel}`, (event, ...args) => func(...args));
      // }
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
