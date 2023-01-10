"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@lib/core");
const types_1 = require("@lib/types");
const express_1 = __importStar(require("express"));
const DEFAULT_SERVER_PORT = 8000;
class Server {
    _app;
    _port;
    _server;
    _controllers;
    _diContainer;
    constructor() {
        this._app = (0, express_1.default)();
        this._app.use(express_1.default.json());
        this._port = Number(process.env.PORT) ?? DEFAULT_SERVER_PORT;
        this._diContainer = core_1.DiContainer.getInstance();
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
    setControllers(controllers) {
        this._controllers = controllers;
    }
    _initControllers() {
        this._controllers?.forEach((ControllerClass) => {
            const basePath = Reflect.getMetadata(types_1.MetadataKeys.BASE_PATH, ControllerClass);
            const routes = Reflect.getMetadata(types_1.MetadataKeys.ROUTES, ControllerClass);
            const injectedProperties = Reflect.getMetadata('dependencies-keys-property', ControllerClass);
            const expressRouter = (0, express_1.Router)();
            const controllerInstance = new ControllerClass();
            // TODO: Refactor this code to make property injection more clear
            // TODO: Define a service interface to be used as type to be injected
            injectedProperties.forEach(({ propertyKey, propertyType }) => {
                controllerInstance[propertyKey] = this._diContainer.getInjectable(propertyType);
            });
            routes.forEach(({ method, path, handlerName }) => {
                expressRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));
                console.info(`🚀[server] ${method.toLocaleUpperCase()} ${basePath + path} controller registered. (${ControllerClass.name}.${String(handlerName)})`);
            });
            this._app.use(basePath, expressRouter);
        });
    }
    start() {
        this._initControllers();
        this._app.get('/', (_, res) => {
            res.json({
                status: 'OK',
                container: 'RCDB API',
            });
        });
        this._server = this._app.listen(this._port, () => {
            console.log(`⚡[server]: Server is running at http://localhost:${this._port}`);
        });
    }
}
exports.default = Server;
