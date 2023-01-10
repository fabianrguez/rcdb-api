"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@lib/types");
function Controller(basePath) {
    return (target) => {
        Reflect.defineMetadata(types_1.MetadataKeys.BASE_PATH, basePath, target);
    };
}
exports.default = Controller;
