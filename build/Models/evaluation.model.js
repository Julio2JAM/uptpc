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
exports.EvaluationModel = exports.Evaluation = void 0;
const typeorm_1 = require("typeorm");
const model_1 = require("../Base/model");
const assignment_model_1 = require("./assignment.model");
const enrollment_model_1 = require("./enrollment.model");
const class_validator_1 = require("class-validator");
let Evaluation = class Evaluation {
    constructor(data) {
        this.assignment = data === null || data === void 0 ? void 0 : data.assignment;
        this.enrollment = data === null || data === void 0 ? void 0 : data.enrollment;
        this.grade = Number(data === null || data === void 0 ? void 0 : data.grade);
        this.id_status = data === null || data === void 0 ? void 0 : data.id_status;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Evaluation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => assignment_model_1.Assignment, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_assignment" }),
    (0, typeorm_1.Index)("assignment_grade_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "The assignment is required" }),
    __metadata("design:type", assignment_model_1.Assignment)
], Evaluation.prototype, "assignment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => enrollment_model_1.Enrollment, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_enrollment" }),
    (0, typeorm_1.Index)("assignment_grade_FK_2"),
    (0, class_validator_1.IsNotEmpty)({ message: "The enrollment is required" }),
    __metadata("design:type", enrollment_model_1.Enrollment)
], Evaluation.prototype, "enrollment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: true, width: 4 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The grade is required" }),
    (0, class_validator_1.IsInt)({ message: "The grade must be a integer" }),
    (0, class_validator_1.IsPositive)({ message: "The grade must be a positive number" }),
    __metadata("design:type", Number)
], Evaluation.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Evaluation.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Evaluation.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Evaluation.prototype, "id_status", void 0);
Evaluation = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Evaluation);
exports.Evaluation = Evaluation;
class EvaluationModel extends model_1.Model {
}
exports.EvaluationModel = EvaluationModel;
