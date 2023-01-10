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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoasterSchema = void 0;
const _config_1 = __importDefault(require("../config"));
const mongoose_1 = __importStar(require("mongoose"));
exports.CoasterSchema = new mongoose_1.Schema({
    id: Number,
    name: String,
    parkName: String,
    city: String,
    state: String,
    status: {
        state: String,
        date: String,
    },
    country: String,
    link: String,
    make: String,
    model: String,
    type: String,
    design: String,
    stats: {
        length: Array || String,
        height: Array || String,
        speed: Array || String,
        inversions: String,
        duration: String,
        arrangement: String,
        capacity: String,
        dimensions: Array || String,
        designer: String,
        verticalAngle: String,
        gForce: String,
        drop: String,
        cost: String,
        builtBy: String,
        elements: Array || String,
        formerNames: Array || String,
    },
});
class DataBase {
    _name = 'rollerCoasterDB';
    static _instance;
    _db;
    _coasterModel;
    constructor() {
        mongoose_1.default.set('strictQuery', true);
        // this._db = new JsonDB(new Config(this._name, true, false, '/'));
        this.initDB();
    }
    async initDB() {
        await mongoose_1.default
            .connect(String(_config_1.default.MONGODB_URI))
            .then(() => {
            console.log('⚡[database] connected to database');
            this._coasterModel = mongoose_1.default.model('coaster', exports.CoasterSchema);
        })
            .catch((error) => console.error(error));
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new DataBase();
        }
        return this._instance;
    }
    async pushData(key, data) {
        const _data = new this._coasterModel(data);
        await _data.save().catch(() => console.error(`Error saving coaster with id => ${key}`));
        // this._db.push(key, data, true);
    }
    async getData() {
        return this._coasterModel.find();
        // return await this._db.getData('/');
    }
    async close() {
        await mongoose_1.default.disconnect();
    }
}
exports.default = DataBase;
