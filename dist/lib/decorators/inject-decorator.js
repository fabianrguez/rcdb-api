"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Inject() {
    return function (target, propertyKey) {
        const containerClass = target.constructor;
        const PropertyType = Reflect.getMetadata('design:type', target, propertyKey);
        const injectedTypes = Reflect.getMetadata('dependencies-keys-property', target) ?? [];
        const data = {
            propertyKey,
            propertyType: PropertyType.name,
        };
        if (PropertyType.name) {
            Reflect.defineMetadata('dependencies-keys-property', [...injectedTypes, data], containerClass);
        }
    };
}
exports.default = Inject;
