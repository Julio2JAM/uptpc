"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomModel = exports.Classroom = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Classroom = class Classroom {
    constructor(dataClassroom) {
        this.seccion = dataClassroom === null || dataClassroom === void 0 ? void 0 : dataClassroom.get("seccion");
        this.datetime_start = dataClassroom === null || dataClassroom === void 0 ? void 0 : dataClassroom.get("datetime_start");
        this.datetime_end = dataClassroom === null || dataClassroom === void 0 ? void 0 : dataClassroom.get("datetime_end");
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Classroom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false, length: 20 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The section is required" })
], Classroom.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true })
], Classroom.prototype, "datetime_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true })
], Classroom.prototype, "datetime_end", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Classroom.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", default: "1", nullable: false })
], Classroom.prototype, "id_status", void 0);
Classroom = __decorate([
    (0, typeorm_1.Entity)()
], Classroom);
exports.Classroom = Classroom;
class ClassroomModel extends model_1.Model {
}
exports.ClassroomModel = ClassroomModel;
