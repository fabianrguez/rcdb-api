"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
function Service() {
    return (target) => {
        const injectionContainer = core_1.DiContainer.getInstance();
        const classInstance = new target();
        const { name } = classInstance.constructor;
        injectionContainer.setInjectable(name, classInstance);
    };
}
exports.default = Service;
