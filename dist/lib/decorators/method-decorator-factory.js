"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
function methodDecoratorFactory(method) {
    return (path = '') => {
        return (target, propertyKey) => {
            const controllerClass = target.constructor;
            const routers = Reflect.hasMetadata(types_1.MetadataKeys.ROUTES, controllerClass)
                ? Reflect.getMetadata(types_1.MetadataKeys.ROUTES, controllerClass)
                : [];
            routers.push({
                method,
                path,
                handlerName: propertyKey,
            });
            Reflect.defineMetadata(types_1.MetadataKeys.ROUTES, routers, controllerClass);
        };
    };
}
exports.default = methodDecoratorFactory;
