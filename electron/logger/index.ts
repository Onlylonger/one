import { isDev } from '../utils';
import log from 'electron-log';
import { app } from 'electron';
import { join } from 'node:path';

if (isDev) {
  log.transports.file.resolvePath = () => join(app.getAppPath(), 'logs/main.log');
}
