"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiContainer {
    static _instance;
    _injectables;
    _controllers = [];
    constructor() { }
    setInjectable(key, provider) {
        this._injectables = {
            ...this._injectables,
            [key]: provider,
        };
    }
    setController(controller) {
        this._controllers = [...this._controllers, controller];
    }
    getInjectable(key) {
        const injectable = this._injectables[key];
        if (!injectable) {
            throw new Error(`Not found ${key} injectable`);
        }
        return injectable;
    }
    getControllers() {
        return this._controllers;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new DiContainer();
        }
        return this._instance;
    }
}
exports.default = DiContainer;
