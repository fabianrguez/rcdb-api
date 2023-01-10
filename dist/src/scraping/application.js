"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rcdb_1 = __importDefault(require("@scraping/rcdb"));
const db_1 = __importDefault(require("../../db"));
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
    _jsonDb;
    // private readonly _rollerCoasterService: RollerCoasterService;
    constructor() {
        console.log(`${title} ${version}`);
        this._jsonDb = db_1.default.getInstance();
        // this._rollerCoasterService = new RollerCoasterService();
    }
    async start(region) {
        const coasters = await rcdb_1.default.scrapeCoasters({ region });
        console.log('Saving coasters data to database');
        await this._jsonDb
            .writeDBFile('coasters', coasters)
            .then(() => {
            console.log('🎢 Coasters data saved!');
        })
            .catch((err) => console.error('‼️ Error creating coasters database file...', err));
        // coasters.forEach((coaster: RollerCoaster) => this._rollerCoasterService.populateDBData(coaster));
    }
}
exports.default = Application;
