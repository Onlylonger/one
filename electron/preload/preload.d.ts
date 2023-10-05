import { ElectronHandler } from './index';

declare global {
  interface Window {
    electron: ElectronHandler;
    __OnePick: any;
  }
}

export {};
