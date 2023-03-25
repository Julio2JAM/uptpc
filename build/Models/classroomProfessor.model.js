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
exports.ClassroomProfessorModel = exports.ClassroomProfessor = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const employee_model_1 = require("./employee.model");
const subject_model_1 = require("./subject.model");
const classroom_model_1 = require("./classroom.model");
const statusHttp_1 = require("../Base/statusHttp");
let ClassroomProfessor = class ClassroomProfessor {
    constructor(data) {
        this.id_classroom = data === null || data === void 0 ? void 0 : data.get("id_classroom");
        this.id_professor = data === null || data === void 0 ? void 0 : data.get("id_professor");
        this.id_subject = data === null || data === void 0 ? void 0 : data.get("id_subject");
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], ClassroomProfessor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom" }),
    (0, class_validator_1.IsInt)({ message: "The classroom is not available" })
], ClassroomProfessor.prototype, "id_classroom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a professor" }),
    (0, class_validator_1.IsInt)({ message: "The professor is not available" })
], ClassroomProfessor.prototype, "id_professor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a subject" }),
    (0, class_validator_1.IsInt)({ message: "The subject is not available" })
], ClassroomProfessor.prototype, "id_subject", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], ClassroomProfessor.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false, default: 1 })
], ClassroomProfessor.prototype, "id_status", void 0);
ClassroomProfessor = __decorate([
    (0, typeorm_1.Entity)()
], ClassroomProfessor);
exports.ClassroomProfessor = ClassroomProfessor;
class ClassroomProfessorModel extends model_1.Model {
    post_validation(dataClassroomProfessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                employee: yield this.getById(employee_model_1.Employee, dataClassroomProfessor.id_professor),
                subject: yield this.getById(subject_model_1.Subject, dataClassroomProfessor.id_subject),
                classroom: yield this.getById(classroom_model_1.Classroom, dataClassroomProfessor.id_classroom)
            };
            for (let value in data) {
                if (!data[value]) {
                    console.log(`${value} not found`);
                    return { error: `${value} not found`, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
                }
            }
            const classroomProfessor = yield this.create(ClassroomProfessor, dataClassroomProfessor);
            return { classroomProfessor, status: statusHttp_1.HTTP_STATUS.CREATED };
        });
    }
}
exports.ClassroomProfessorModel = ClassroomProfessorModel;
