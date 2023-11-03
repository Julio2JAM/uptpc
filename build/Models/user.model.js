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
exports.UserModel = exports.User = void 0;
const model_1 = require("../Base/model");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const role_model_1 = require("./role.model");
const person_model_1 = require("./person.model");
let User = class User {
    constructor(data) {
        this.role = data === null || data === void 0 ? void 0 : data.role;
        this.username = data === null || data === void 0 ? void 0 : data.username;
        this.password = data === null || data === void 0 ? void 0 : data.password;
        this.person = data === null || data === void 0 ? void 0 : data.person;
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_model_1.Role, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_level" }),
    (0, typeorm_1.Index)("user_fk_1"),
    __metadata("design:type", role_model_1.Role)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, nullable: false, unique: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a username" }),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 80, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_model_1.Person, { nullable: true, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_person" }),
    (0, typeorm_1.Index)("user_FK_2"),
    __metadata("design:type", person_model_1.Person)
], User.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "id_status", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
class UserModel extends model_1.Model {
}
exports.UserModel = UserModel;
