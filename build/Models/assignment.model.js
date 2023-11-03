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
exports.AssignmentModel = exports.Assignment = void 0;
//Entity
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
//Models
const program_model_1 = require("./program.model");
const model_1 = require("../Base/model");
const database_1 = __importDefault(require("../database/database"));
let Assignment = class Assignment {
    constructor(data) {
        this.program = data === null || data === void 0 ? void 0 : data.program;
        this.name = data === null || data === void 0 ? void 0 : data.name;
        this.description = data === null || data === void 0 ? void 0 : data.description;
        this.porcentage = Number(data === null || data === void 0 ? void 0 : data.porcentage);
        this.base = Number(data === null || data === void 0 ? void 0 : data.base);
        this.datetime_end = data === null || data === void 0 ? void 0 : data.datetime_end;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Assignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => program_model_1.Program, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "id_program" }),
    (0, typeorm_1.Index)("assignment_FK_1"),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom, professor and subject" }),
    __metadata("design:type", program_model_1.Program)
], Assignment.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "The name of the assignment is not specified" }),
    __metadata("design:type", String)
], Assignment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "The description of the assignment is not specified" }),
    __metadata("design:type", String)
], Assignment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 3, nullable: false }),
    (0, class_validator_1.IsInt)({ message: "The porcentage is not numeric" }),
    (0, class_validator_1.Min)(1, { message: "The porcentage must be greater than 0" }),
    (0, class_validator_1.Max)(100, { message: "The porcentage must be less than 100" }),
    __metadata("design:type", Number)
], Assignment.prototype, "porcentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 3, nullable: true, default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)({ message: 'The base of the evaluation must be greater than 0' }),
    (0, class_validator_1.IsInt)({ message: "The base is not numeric" }),
    __metadata("design:type", Number)
], Assignment.prototype, "base", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], Assignment.prototype, "datetime_end", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Assignment.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Assignment.prototype, "datetime_updated", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "tinyint", width: 2, default: 1, nullable: false }),
    __metadata("design:type", Number)
], Assignment.prototype, "id_status", void 0);
Assignment = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Assignment);
exports.Assignment = Assignment;
class AssignmentModel extends model_1.Model {
    /**
     * Al colocarle el porcentaje a una actividad, entre todas las que se han creado, solo debe dar como maximo
     * 100%, esta funcion retorna el porcentaje que aun se le puede asignar a una nueva actividad
     * @param id_program program identifier
     * @returns porcentage
     */
    calculatePorcentage(id_program) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield database_1.default.createQueryBuilder(Assignment, "assignment")
                .leftJoinAndSelect("assignment.program", "program")
                .where("program.id = :id_program", { id_program: id_program })
                .groupBy("program.id")
                .select("(100 - SUM(assignment.porcentage))", "porcentage")
                .getRawOne();
            return query;
        });
    }
}
exports.AssignmentModel = AssignmentModel;
