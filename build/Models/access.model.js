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
exports.AccessModel = exports.Access = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const user_model_1 = require("./user.model");
let Access = class Access {
    constructor(data) {
        this.user = data === null || data === void 0 ? void 0 : data.user;
        this.token = data === null || data === void 0 ? void 0 : data.token;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Access.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false, length: 200 }),
    (0, class_validator_1.IsNotEmpty)({ message: "Access requires a token" }),
    __metadata("design:type", String)
], Access.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "idUser" }),
    (0, typeorm_1.Index)("access_FK_1", { synchronize: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "User is required" }),
    __metadata("design:type", user_model_1.User)
], Access.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Access.prototype, "datetime", void 0);
Access = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Access);
exports.Access = Access;
class AccessModel extends model_1.Model {
}
exports.AccessModel = AccessModel;
