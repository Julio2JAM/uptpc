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
exports.ClassroomStudentModel = exports.ClassroomStudent = void 0;
const typeorm_1 = require("typeorm");
const classroom_model_1 = require("./classroom.model");
const student_model_1 = require("./student.model");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const statusHttp_1 = require("../Base/statusHttp");
//import AppDataSource from "../database/database";
let ClassroomStudent = class ClassroomStudent {
    constructor(data) {
        this.id_classroom = data === null || data === void 0 ? void 0 : data.get("id_grade");
        this.id_student = data === null || data === void 0 ? void 0 : data.get("id_student");
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], ClassroomStudent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false, width: 11 }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom" }),
    (0, class_validator_1.IsInt)({ message: "The classroom is not available" })
], ClassroomStudent.prototype, "id_classroom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false, width: 11 }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a student" }),
    (0, class_validator_1.IsInt)({ message: "The student is not available" })
], ClassroomStudent.prototype, "id_student", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], ClassroomStudent.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", nullable: false, width: 3, default: 1 })
], ClassroomStudent.prototype, "id_status", void 0);
ClassroomStudent = __decorate([
    (0, typeorm_1.Entity)()
], ClassroomStudent);
exports.ClassroomStudent = ClassroomStudent;
class ClassroomStudentModel extends model_1.Model {
    post_validation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield this.getById(classroom_model_1.Classroom, data.id_classroom);
            const student = yield this.getById(student_model_1.Student, data.id_student);
            /*
            //Select tomando campos especificos
            const user = await AppDataSource.manager
            .createQueryBuilder(Grade, "grade")
            .select("grade.id, grade.seccion")
            .where("id = :id", { id:1 })
            .getRawOne();
            */
            if (!classroom) {
                return { error: "classroom not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            if (!student) {
                return { error: "student not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            //const classroomStudent = await AppDataSource.manager.save(ClassroomStudent,data);
            const classroomStudent = yield this.create(ClassroomStudent, data);
            return { classroomStudent, status: statusHttp_1.HTTP_STATUS.CREATED };
        });
    }
}
exports.ClassroomStudentModel = ClassroomStudentModel;
