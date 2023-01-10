"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../..");
const decorators_1 = require("@lib/decorators");
let RollerCoastersController = class RollerCoastersController {
    _rollercoasterService;
    indexRoute(req, res) {
        const { offset = '0', limit = Infinity } = req.query;
        this._rollercoasterService
            .getAllCoasters(Number(offset), Number(limit))
            .then((coasters) => res.status(200).json({ data: coasters, totalItems: coasters.length }))
            .catch((e) => res.status(400).json({ error: e }));
    }
};
__decorate([
    (0, decorators_1.Inject)(),
    __metadata("design:type", services_1.RollerCoasterService)
], RollerCoastersController.prototype, "_rollercoasterService", void 0);
__decorate([
    (0, decorators_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RollerCoastersController.prototype, "indexRoute", null);
RollerCoastersController = __decorate([
    (0, decorators_1.Controller)('/api/coasters')
], RollerCoastersController);
exports.default = RollerCoastersController;
