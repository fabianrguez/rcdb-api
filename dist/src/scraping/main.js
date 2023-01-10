"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = __importDefault(require("@scraping/application"));
const commander_1 = require("commander");
commander_1.program.option('--region <regionName>');
commander_1.program.parse();
const { region = 'Europe' } = commander_1.program.opts();
const app = new application_1.default();
app.start(region);
