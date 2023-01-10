"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_json_db_1 = require("node-json-db");
class DataBase {
    _name = 'rollerCoasterDB';
    static _instance;
    _db;
    constructor() {
        this._db = new node_json_db_1.JsonDB(new node_json_db_1.Config(this._name, true, false, '/'));
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new DataBase();
        }
        return this._instance;
    }
    pushData(key, data) {
        this._db.push(key, data, true);
    }
    async getData() {
        return await this._db.getData('/');
    }
}
exports.default = DataBase;
