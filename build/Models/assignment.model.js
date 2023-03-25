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
exports.AssignmentModel = exports.Assignment = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const classroomProfessor_model_1 = require("./classroomProfessor.model");
const model_1 = require("../Base/model");
const statusHttp_1 = require("../Base/statusHttp");
let Assignment = class Assignment {
    constructor(dataAssignment) {
        this.id_classroomProfessor = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('id_classroomProfessor');
        this.name = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('name');
        this.description = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('description');
        this.porcentage = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('porcentage');
        this.quantity = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('quantity');
        this.datetime_end = dataAssignment === null || dataAssignment === void 0 ? void 0 : dataAssignment.get('datetime_end');
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Assignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a classroom, professor and subject" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsInt)({ message: "The classroom is not available" })
], Assignment.prototype, "id_classroomProfessor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "The name of the assignment is not specified" })
], Assignment.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    (0, class_validator_1.IsNotEmpty)({ message: "The description of the assignment is not specified" })
], Assignment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 3, nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "The porcentage of the assignment is required" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsInt)({ message: "The porcentage is not numeric" }),
    (0, class_validator_1.Min)(1, { message: "The porcentage must be greater than 0" }),
    (0, class_validator_1.Max)(100, { message: "The porcentage must be less than 100" })
], Assignment.prototype, "porcentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 3, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)({ message: 'The porcentage must be greater than 0' }),
    (0, class_validator_1.IsInt)({ message: "The quantity is not numeric" })
], Assignment.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    (0, class_validator_1.IsOptional)()
], Assignment.prototype, "datetime_end", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Assignment.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1 })
], Assignment.prototype, "id_status", void 0);
Assignment = __decorate([
    (0, typeorm_1.Entity)()
], Assignment);
exports.Assignment = Assignment;
class AssignmentModel extends model_1.Model {
    post_validation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroomProfessor = yield this.getById(classroomProfessor_model_1.ClassroomProfessor, data.id_classroomProfessor);
            if (!classroomProfessor) {
                return { error: "The classroom, professor and subject was not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST };
            }
            const assignment = yield this.create(Assignment, data);
            return { assignment, status: statusHttp_1.HTTP_STATUS.CREATED };
        });
    }
}
exports.AssignmentModel = AssignmentModel;
