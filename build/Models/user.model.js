"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
//import AppDataSource from "../database/database"
const model_1 = require("../Base/model");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let User = class User {
    constructor(id_level, username, password) {
        this.id_level = id_level;
        this.username = username;
        this.password = password;
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 3, nullable: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)({ message: "Level is requiered" })
], User.prototype, "id_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, nullable: false, unique: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a username" })
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, nullable: false }),
    (0, class_validator_1.MinLength)(8, { message: "The password must be bigger than 8 caracteres" }),
    (0, class_validator_1.MaxLength)(16, { message: "The password must be smaller than 16 caracteres" })
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false })
], User.prototype, "id_status", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
class UserModel extends model_1.Model {
}
exports.UserModel = UserModel;
