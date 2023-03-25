"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.Student = void 0;
//import AppDataSource from "../database/database"
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Student = class Student {
    constructor(dataStudent) {
        this.cedule = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get('cedule');
        this.name = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get("name");
        this.lastName = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get("lastName");
        this.phone = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get("phone");
        this.email = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get("email");
        this.birthday = dataStudent === null || dataStudent === void 0 ? void 0 : dataStudent.get("birthday");
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unique: true, nullable: false, width: 12 }),
    (0, class_validator_1.IsNotEmpty)({ "message": "The C.I is obligatory" }),
    (0, class_validator_1.IsNumber)()
], Student.prototype, "cedule", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Student.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Student.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 14 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)()
], Student.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, length: 60 }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)()
], Student.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: null }),
    (0, class_validator_1.IsDate)()
], Student.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Student.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false })
], Student.prototype, "id_status", void 0);
Student = __decorate([
    (0, typeorm_1.Entity)()
], Student);
exports.Student = Student;
class StudentModel extends model_1.Model {
}
exports.StudentModel = StudentModel;
