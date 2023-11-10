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
exports.StudentModel = exports.Student = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const person_model_1 = require("./person.model");
let Student = class Student {
    constructor(data) {
        this.person = typeof (data === null || data === void 0 ? void 0 : data.person) === "string" ? JSON.parse(data === null || data === void 0 ? void 0 : data.person) : data === null || data === void 0 ? void 0 : data.person;
        this.representative1 = data === null || data === void 0 ? void 0 : data.representative1;
        this.representative2 = data === null || data === void 0 ? void 0 : data.representative2;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_model_1.Person, { nullable: false, createForeignKeyConstraints: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_person" }),
    (0, typeorm_1.Index)("student_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "Person is required" }),
    __metadata("design:type", person_model_1.Person)
], Student.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_model_1.Person, { nullable: true, createForeignKeyConstraints: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_representative_1" }),
    (0, typeorm_1.Index)("student_FK_2"),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", person_model_1.Person)
], Student.prototype, "representative1", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => person_model_1.Person, { nullable: true, createForeignKeyConstraints: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_representative_2" }),
    (0, typeorm_1.Index)("student_FK_3"),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", person_model_1.Person)
], Student.prototype, "representative2", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Student.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Student.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false, default: 1, width: 3 }),
    __metadata("design:type", Number)
], Student.prototype, "id_status", void 0);
Student = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Student);
exports.Student = Student;
class StudentModel extends model_1.Model {
}
exports.StudentModel = StudentModel;
