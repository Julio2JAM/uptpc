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
exports.PersonModel = exports.Person = void 0;
//import AppDataSource from "../database/database"
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Person = class Person {
    constructor(data) {
        this.cedule = (data === null || data === void 0 ? void 0 : data.cedule) && Number(data === null || data === void 0 ? void 0 : data.cedule);
        this.name = (data === null || data === void 0 ? void 0 : data.name) && (data === null || data === void 0 ? void 0 : data.name.toUpperCase());
        this.lastName = (data === null || data === void 0 ? void 0 : data.lastName) && (data === null || data === void 0 ? void 0 : data.lastName.toUpperCase());
        this.phone = (data === null || data === void 0 ? void 0 : data.phone) && String(parseInt(data === null || data === void 0 ? void 0 : data.phone));
        this.email = data === null || data === void 0 ? void 0 : data.email;
        this.birthday = (data === null || data === void 0 ? void 0 : data.birthday) && new Date(data === null || data === void 0 ? void 0 : data.birthday);
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unique: true, nullable: false, width: 12 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The identification is obligatory" }),
    (0, class_validator_1.IsPositive)({ message: "The identification must be positive" }),
    (0, class_validator_1.IsInt)({ message: "The identification is not available" }),
    __metadata("design:type", Number)
], Person.prototype, "cedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null, nullable: true, length: 60 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Person.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null, nullable: true, length: 60 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null, nullable: true, length: 14 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Person.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: null, nullable: true, length: 60 }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Person.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: null, nullable: true }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], Person.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Person.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], Person.prototype, "id_status", void 0);
Person = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Person);
exports.Person = Person;
class PersonModel extends model_1.Model {
}
exports.PersonModel = PersonModel;
