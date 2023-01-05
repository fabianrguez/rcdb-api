import Server from '@lib/core';
import dotenv from 'dotenv';
import { RollerCoastersController } from '@app/controllers';

class Application {
  _appServer: Server;

  constructor() {
    dotenv.config();

    this._appServer = new Server();
    this._appServer.setControllers([RollerCoastersController]);
  }

  start() {
    this._appServer.start();
  }
}

new Application().start();
