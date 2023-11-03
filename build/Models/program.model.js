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
exports.ProgramModel = exports.Program = void 0;
//Entity
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
//Models
const model_1 = require("../Base/model");
const subject_model_1 = require("./subject.model");
const professor_model_1 = require("./professor.model");
const classroom_model_1 = require("./classroom.model");
let Program = class Program {
    constructor(data) {
        this.classroom = data === null || data === void 0 ? void 0 : data.classroom;
        this.professor = data === null || data === void 0 ? void 0 : data.professor;
        this.subject = data === null || data === void 0 ? void 0 : data.subject;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Program.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => classroom_model_1.Classroom, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_classroom" }),
    (0, typeorm_1.Index)("program_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom" }),
    (0, class_validator_1.IsInt)({ message: "The classroom is not available" }),
    __metadata("design:type", classroom_model_1.Classroom)
], Program.prototype, "classroom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => professor_model_1.Professor, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_professor" }),
    (0, typeorm_1.Index)("program_FK_2"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a professor" }),
    __metadata("design:type", professor_model_1.Professor)
], Program.prototype, "professor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_model_1.Subject, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_subject" }),
    (0, typeorm_1.Index)("program_FK_3"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a subject" }),
    __metadata("design:type", subject_model_1.Subject)
], Program.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Program.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false, width: 3, default: 1 }),
    __metadata("design:type", Number)
], Program.prototype, "id_status", void 0);
Program = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Program);
exports.Program = Program;
class ProgramModel extends model_1.Model {
}
exports.ProgramModel = ProgramModel;
