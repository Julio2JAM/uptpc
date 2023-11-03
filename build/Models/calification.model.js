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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalificationModel = exports.Calification = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const program_model_1 = require("./program.model");
const enrollment_model_1 = require("./enrollment.model");
const database_1 = __importDefault(require("../database/database"));
const evaluation_model_1 = require("./evaluation.model");
let Calification = class Calification {
    constructor(data) {
        this.program = data === null || data === void 0 ? void 0 : data.program;
        this.enrollment = data === null || data === void 0 ? void 0 : data.enrollment;
        this.grade = Number(data === null || data === void 0 ? void 0 : data.grade);
        this.id_status = data === null || data === void 0 ? void 0 : data.id_status;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Calification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => program_model_1.Program, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_program" }),
    (0, typeorm_1.Index)("subject_grade_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "The program is required" }),
    __metadata("design:type", program_model_1.Program)
], Calification.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => enrollment_model_1.Enrollment, { nullable: false, createForeignKeyConstraints: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_enrollment" }),
    (0, typeorm_1.Index)("subject_grade_FK_2"),
    (0, class_validator_1.IsNotEmpty)({ message: "The enrollment is required" }),
    __metadata("design:type", enrollment_model_1.Enrollment)
], Calification.prototype, "enrollment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: true, width: 3 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The grade is required" }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: "The grade must be greater than 0" }),
    __metadata("design:type", Number)
], Calification.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Calification.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Calification.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Calification.prototype, "id_status", void 0);
Calification = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Calification);
exports.Calification = Calification;
class CalificationModel extends model_1.Model {
    calculateGrade(id_program, id_student) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default.createQueryBuilder(evaluation_model_1.Evaluation, "evaluation")
                .leftJoinAndSelect("evaluation.assignment", "assignment")
                .leftJoinAndSelect("evaluation.enrollment", "enrollment")
                .where("assignment.id_program = :id_program", { id_program: id_program })
                .andWhere("enrollment.id_student = :id_student", { id_student: id_student })
                .groupBy("enrollment.id_student")
                .select("SUM(evaluation.grade)/COUNT(evaluation.id)", "grade")
                .getRawOne();
            return query;
        });
    }
}
exports.CalificationModel = CalificationModel;
