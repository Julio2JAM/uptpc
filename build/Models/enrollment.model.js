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
exports.EnrollmentModel = exports.Enrollment = void 0;
const typeorm_1 = require("typeorm");
const classroom_model_1 = require("./classroom.model");
const student_model_1 = require("./student.model");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const database_1 = __importDefault(require("../database/database"));
let Enrollment = class Enrollment {
    constructor(data) {
        var _a;
        this.classroom = data === null || data === void 0 ? void 0 : data.classroom;
        this.student = data === null || data === void 0 ? void 0 : data.student;
        this.id_status = (_a = data === null || data === void 0 ? void 0 : data.id_status) !== null && _a !== void 0 ? _a : 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Enrollment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => classroom_model_1.Classroom, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "id_classroom" }),
    (0, typeorm_1.Index)("enrollment_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom" }),
    __metadata("design:type", classroom_model_1.Classroom)
], Enrollment.prototype, "classroom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_model_1.Student, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "id_student" }),
    (0, typeorm_1.Index)("enrollment_FK_2"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a person" }),
    __metadata("design:type", student_model_1.Student)
], Enrollment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Enrollment.prototype, "datetime_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Enrollment.prototype, "id_status", void 0);
Enrollment = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Enrollment);
exports.Enrollment = Enrollment;
class EnrollmentModel extends model_1.Model {
    programRelation(classroom) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default.createQueryBuilder(Enrollment, "enrollment")
                .leftJoinAndSelect("enrollment.classroom", "classroom")
                .leftJoinAndSelect("enrollment.student", "student")
                .leftJoinAndSelect("program.classroom", "classroom")
                .where("classroom.id = :classroom", { classroom: classroom })
                .getMany();
            /*const query2 = await AppDataSource.createQueryBuilder(Classroom, "classroom")
            .leftJoinAndSelect("program.classroom", "classroom")
            .leftJoinAndSelect("program.professor", "professor")
            .leftJoinAndSelect("program.subject", "subject")
            .leftJoinAndSelect("enrollment.classroom", "classroom")
            .leftJoinAndSelect("enrollment.student", "student")
            .where("classroom.id = :classroom", {classroom:classroom})
            //.where("student.id = :student", {student:student})
            //.where("professor.id = :professor", {professor:professor})
            .getMany();*/
            return query;
        });
    }
    assigment(classroom) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield database_1.default.createQueryBuilder(Enrollment, "enrollment")
                .leftJoinAndSelect("asigmentGrade", "asigmentGrade", "asigmentGrade.id_enrollment = enrollment.id")
                .where("enrollment.id_classroom = :classroom", { classroom: classroom })
                .getMany();
            return enrollment;
        });
    }
    studentNoClassroom() {
        return __awaiter(this, void 0, void 0, function* () {
            const Students = yield database_1.default.createQueryBuilder(student_model_1.Student, "student")
                .leftJoinAndSelect("student.person", "person")
                .leftJoinAndSelect("student.representative1", "representative1")
                .leftJoinAndSelect("student.representative2", "representative2")
                .leftJoinAndSelect("enrollment", "enrollment", "enrollment.id_student = student.id")
                //.where("enrollment.id IS NULL")
                .getMany();
            return Students;
        });
    }
}
exports.EnrollmentModel = EnrollmentModel;
