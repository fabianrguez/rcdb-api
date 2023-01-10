import Server from '@lib/core';
import dotenv from 'dotenv';
import { RollerCoastersController, IndexController } from '@app/controllers';

class Application {
  _appServer: Server;

  constructor() {
    dotenv.config();

    this._appServer = new Server();
    this._appServer.setControllers([IndexController, RollerCoastersController]);
  }

  start() {
    this._appServer.start();
  }
}

const application = new Application();

application.start();

export default application._appServer.app;
