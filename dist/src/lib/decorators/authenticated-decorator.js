"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authenticated() {
    return (target, propertyKey, descriptor) => {
        const { value: original } = descriptor;
        descriptor.value = function (...args) {
            const [request, response] = args;
            const { headers } = request;
            // TODO check if authorization token is valid
            if (headers.authorization) {
                return original.apply(this, args);
            }
            response.status(403).json({ error: 'Not Authorized' });
        };
    };
}
exports.default = authenticated;
