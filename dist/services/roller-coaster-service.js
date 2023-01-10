"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../lib/decorators");
const db_1 = __importDefault(require("../db"));
let RollerCoasterService = class RollerCoasterService {
    _db;
    constructor() {
        this._db = db_1.default.getInstance();
    }
    populateDBData(data) {
        this._db.pushData(`/coasters/${data.id}`, data);
    }
    async getAllCoasters(offset, limit) {
        return await this._db.getData();
        // const coastersData: RollerCoaster[] = Object.values(data).map((coaster: RollerCoaster) => coaster);
    }
};
RollerCoasterService = __decorate([
    (0, decorators_1.Service)(),
    __metadata("design:paramtypes", [])
], RollerCoasterService);
exports.default = RollerCoasterService;
