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
exports.ProfessorModel = exports.Professor = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
const person_model_1 = require("./person.model");
let Professor = class Professor {
    constructor(data) {
        var _a;
        this.person = data === null || data === void 0 ? void 0 : data.person;
        //this.profession = data?.profession;
        this.id_status = (_a = data === null || data === void 0 ? void 0 : data.id_status) !== null && _a !== void 0 ? _a : 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Professor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_model_1.Person, { nullable: false, createForeignKeyConstraints: true, cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "id_person" }),
    (0, typeorm_1.Index)("professor_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "Person must be send" }),
    __metadata("design:type", person_model_1.Person)
], Professor.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Professor.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Professor.prototype, "datetime_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Professor.prototype, "id_status", void 0);
Professor = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Professor);
exports.Professor = Professor;
class ProfessorModel extends model_1.Model {
}
exports.ProfessorModel = ProfessorModel;
