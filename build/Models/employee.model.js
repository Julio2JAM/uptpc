"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModel = exports.Employee = void 0;
//import AppDataSource from "../database/database"
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Employee = class Employee {
    constructor(dataEmployee) {
        this.id_profession = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("id_profession");
        this.cedule = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("cedule");
        this.name = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("name");
        this.lastName = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("lastName");
        this.phone = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("phone");
        this.email = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("email");
        this.birthday = dataEmployee === null || dataEmployee === void 0 ? void 0 : dataEmployee.get("birthday");
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)()
], Employee.prototype, "id_profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unique: true, nullable: false, width: 12 }),
    (0, class_validator_1.IsNotEmpty)({ "message": "The C.I is obligatory" }),
    (0, class_validator_1.IsNumber)()
], Employee.prototype, "cedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], Employee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 14 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], Employee.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)()
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDate)()
], Employee.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Employee.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: false, width: 2, default: 1 })
], Employee.prototype, "id_status", void 0);
Employee = __decorate([
    (0, typeorm_1.Entity)()
], Employee);
exports.Employee = Employee;
class EmployeeModel extends model_1.Model {
}
exports.EmployeeModel = EmployeeModel;
