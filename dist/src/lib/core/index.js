"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiContainer = exports.default = void 0;
var server_1 = require("./server");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(server_1).default; } });
var di_container_1 = require("./di-container");
Object.defineProperty(exports, "DiContainer", { enumerable: true, get: function () { return __importDefault(di_container_1).default; } });
