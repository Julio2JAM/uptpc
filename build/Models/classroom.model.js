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
exports.ClassroomModel = exports.Classroom = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Classroom = class Classroom {
    constructor(data) {
        this.name = data === null || data === void 0 ? void 0 : data.name;
        this.datetime_start = !(data === null || data === void 0 ? void 0 : data.datetime_start) ? null : data === null || data === void 0 ? void 0 : data.datetime_start;
        this.datetime_end = !(data === null || data === void 0 ? void 0 : data.datetime_end) ? null : data === null || data === void 0 ? void 0 : data.datetime_end;
        this.id_status = data === null || data === void 0 ? void 0 : data.id_status;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Classroom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false, length: 20 }),
    (0, class_validator_1.IsNotEmpty)({ message: "The section is required" }),
    __metadata("design:type", String)
], Classroom.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], Classroom.prototype, "datetime_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], Classroom.prototype, "datetime_end", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Classroom.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Classroom.prototype, "id_status", void 0);
Classroom = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Classroom);
exports.Classroom = Classroom;
class ClassroomModel extends model_1.Model {
}
exports.ClassroomModel = ClassroomModel;
