"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function LogRequest() {
    return (target, propertyKey, descriptor) => {
        const original = descriptor.value;
        descriptor.value = function (...args) {
            const [request] = args;
            const { url, method, body, headers } = request;
            console.log(`[REQUEST](${url})`, {
                method,
                body,
                headers,
            });
            return original.apply(this, args);
        };
    };
}
exports.default = LogRequest;
