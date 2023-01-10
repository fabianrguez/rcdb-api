"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("./lib/core"));
const dotenv_1 = __importDefault(require("dotenv"));
const controllers_1 = require("./controllers");
class Application {
    _appServer;
    constructor() {
        dotenv_1.default.config();
        this._appServer = new core_1.default();
        this._appServer.setControllers([controllers_1.IndexController, controllers_1.RollerCoastersController]);
    }
    start() {
        this._appServer.start();
    }
}
const application = new Application();
application.start();
exports.default = application._appServer.app;
