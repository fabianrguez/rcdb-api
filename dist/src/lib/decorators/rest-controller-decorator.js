"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@lib/core");
function RestController(basePath) {
    return (target) => {
        console.log('rest controller decorator');
        const injectionContainer = core_1.DiContainer.getInstance();
        const test = target;
        const controllerInfo = {
            name: target.name,
            basePath,
            controllerClass: target,
            instance: new test(),
        };
        injectionContainer.setController(controllerInfo);
    };
}
exports.default = RestController;
