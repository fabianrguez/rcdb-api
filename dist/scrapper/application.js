"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const rcdb_1 = __importDefault(require("./rcdb"));
const title = `
╔═══╦═══╦═══╦══╗─╔═══╗
║╔═╗║╔═╗╠╗╔╗║╔╗║─║╔═╗║
║╚═╝║║─╚╝║║║║╚╝╚╗║╚══╦══╦═╦══╦══╦══╗
║╔╗╔╣║─╔╗║║║║╔═╗║╚══╗║╔═╣╔╣╔╗║╔╗║║═╣
║║║╚╣╚═╝╠╝╚╝║╚═╝║║╚═╝║╚═╣║║╔╗║╚╝║║═╣
╚╝╚═╩═══╩═══╩═══╝╚═══╩══╩╝╚╝╚╣╔═╩══╝
─────────────────────────────║║
─────────────────────────────╚╝`;
const version = 'v0.0.1';
class Application {
    _rollerCoasterService;
    constructor() {
        console.log(`${title} ${version}`);
        this._rollerCoasterService = new services_1.RollerCoasterService();
    }
    async start(region) {
        const coasters = await rcdb_1.default.scrapeCoasters({ region });
        console.log('Saving coasters data to database');
        coasters.forEach((coaster) => this._rollerCoasterService.populateDBData(coaster));
        console.log('🎢 Coasters data saved!');
    }
}
exports.default = Application;
