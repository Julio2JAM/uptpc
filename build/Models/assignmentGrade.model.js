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
exports.AssignmentGradeModel = exports.AssignmentGrade = void 0;
const typeorm_1 = require("typeorm");
const model_1 = require("../Base/model");
const assignment_model_1 = require("./assignment.model");
const student_model_1 = require("./student.model");
const statusHttp_1 = require("../Base/statusHttp");
let AssignmentGrade = class AssignmentGrade {
    constructor(data) {
        this.id_assignment = data === null || data === void 0 ? void 0 : data.get("id_assignment");
        this.id_student = data === null || data === void 0 ? void 0 : data.get("id_student");
        this.grade = data === null || data === void 0 ? void 0 : data.get("grade");
        ;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], AssignmentGrade.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false })
], AssignmentGrade.prototype, "id_assignment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false })
], AssignmentGrade.prototype, "id_student", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false })
], AssignmentGrade.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], AssignmentGrade.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], AssignmentGrade.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false, default: 1 })
], AssignmentGrade.prototype, "id_status", void 0);
AssignmentGrade = __decorate([
    (0, typeorm_1.Entity)()
], AssignmentGrade);
exports.AssignmentGrade = AssignmentGrade;
class AssignmentGradeModel extends model_1.Model {
    post_validation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield this.getById(assignment_model_1.Assignment, data.id_assignment);
            const student = yield this.getById(student_model_1.Student, data.id_student);
            if (!assignment) {
                return { error: "Assignment not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            if (!student) {
                return { error: "Student not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            const assignmentGrade = yield this.create(AssignmentGrade, data);
            return { assignmentGrade, status: statusHttp_1.HTTP_STATUS.CREATED };
        });
    }
}
exports.AssignmentGradeModel = AssignmentGradeModel;
