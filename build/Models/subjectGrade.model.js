"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectGradeModel = exports.SubjectGrade = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const classroomProfessor_model_1 = require("./classroomProfessor.model");
const student_model_1 = require("./student.model");
const statusHttp_1 = require("../Base/statusHttp");
let SubjectGrade = class SubjectGrade {
    constructor(data) {
        this.id_classroomProfessor = data === null || data === void 0 ? void 0 : data.get("id_classroomProfessor");
        this.id_student = data === null || data === void 0 ? void 0 : data.get("id_student");
        this.grade = data === null || data === void 0 ? void 0 : data.get("grade");
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], SubjectGrade.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Subject, professor and classroom are required" }),
    (0, class_validator_1.IsInt)()
], SubjectGrade.prototype, "id_classroomProfessor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "The student is required" }),
    (0, class_validator_1.IsInt)()
], SubjectGrade.prototype, "id_student", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: true, width: 3 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The grade is required" }),
    (0, class_validator_1.IsInt)()
], SubjectGrade.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], SubjectGrade.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], SubjectGrade.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)()
], SubjectGrade.prototype, "id_status", void 0);
SubjectGrade = __decorate([
    (0, typeorm_1.Entity)()
], SubjectGrade);
exports.SubjectGrade = SubjectGrade;
class SubjectGradeModel extends model_1.Model {
    post_validation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroomProfessor = yield this.getById(classroomProfessor_model_1.ClassroomProfessor, data.id_classroomProfessor);
            const student = yield this.getById(student_model_1.Student, data.id_student);
            if (!classroomProfessor) {
                return { error: "ClassroomProfessor not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            if (!student) {
                return { error: "Student not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            const subjectGrade = yield this.create(SubjectGrade, data);
            return { subjectGrade, status: statusHttp_1.HTTP_STATUS.CREATED };
        });
    }
}
exports.SubjectGradeModel = SubjectGradeModel;
