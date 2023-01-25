import 'reflect-metadata';
import { DiContainer } from '@lib/core';
import type { Route } from '@lib/types';
import { MetadataKeys } from '@lib/types';
import type { Express, Handler } from 'express';
import express, { Router } from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';

const DEFAULT_SERVER_PORT = 8000;

export default class Server {
  private readonly _app: Express;
  private readonly _port: number;
  private _server: HttpServer;
  private _controllers: any[] = [];
  private _diContainer: DiContainer;

  constructor() {
    this._app = express();
    this._app.use(express.json());
    this._app.use(express.static('static'));
    this._app.use(cors());
    this._port = Number(process.env.PORT) ?? DEFAULT_SERVER_PORT;
    this._diContainer = DiContainer.getInstance();
  }

  get app() {
    return this._app;
  }

  get port() {
    return this._port;
  }

  get server() {
    return this._server;
  }

  setControllers(controllers: any[]) {
    this._controllers = controllers;
  }

  private _initControllers() {
    [...this._controllers]?.forEach((ControllerClass) => {
      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, ControllerClass);
      const routes: Route[] = Reflect.getMetadata(MetadataKeys.ROUTES, ControllerClass);
      const injectedProperties: any[] = Reflect.getMetadata('dependencies-keys-property', ControllerClass) ?? [];
      const expressRouter = Router();
      const controllerInstance: { [handleName: string]: Handler } = new ControllerClass();

      // TODO: Refactor this code to make property injection more clear
      // TODO: Define a service interface to be used as type to be injected
      injectedProperties.forEach(({ propertyKey, propertyType }) => {
        controllerInstance[propertyKey] = this._diContainer.getInjectable(propertyType);
      });

      routes.forEach(({ method, path, handlerName }: Route) => {
        expressRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));

        console.info(
          `🚀[server] ${method.toLocaleUpperCase()} ${basePath + path} controller registered. (${
            ControllerClass.name
          }.${String(handlerName)})`
        );
      });

      this._app.use(basePath, expressRouter);
    });
  }

  start() {
    this._initControllers();

    this._server = this._app.listen(this._port, () => {
      console.log(`⚡[server]: Server is running at http://localhost:${this._port}`);
    });
  }
}
