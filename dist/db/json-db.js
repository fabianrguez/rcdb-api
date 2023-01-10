"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
class JsonDB {
    static _instance;
    __DB_PATH__ = path_1.default.join(process.cwd(), './src/db');
    constructor() { }
    static getInstance() {
        if (!this._instance) {
            this._instance = new JsonDB();
        }
        return this._instance;
    }
    async writeDBFile(dbName, data) {
        return await (0, promises_1.writeFile)(`${this.__DB_PATH__}/${dbName}.json`, JSON.stringify(data, null, 2), {
            encoding: 'utf-8',
        });
    }
    async readDBFile(dbName) {
        return await (0, promises_1.readFile)(`${this.__DB_PATH__}/${dbName}.json`, 'utf-8').then(JSON.parse);
    }
}
exports.default = JsonDB;
