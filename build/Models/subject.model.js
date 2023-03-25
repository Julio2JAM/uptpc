"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectModel = exports.Subject = void 0;
//import AppDataSource from "../database/database"
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const model_1 = require("../Base/model");
let Subject = class Subject {
    constructor(name /*, code: string*/) {
        this.name = name;
        //this.code = code;
        this.id_status = 1;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Subject.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, nullable: false }),
    (0, class_validator_1.IsNotEmpty)({ message: "Please enter a name" })
], Subject.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' })
], Subject.prototype, "datetime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', width: 2, default: 1, nullable: false })
], Subject.prototype, "id_status", void 0);
Subject = __decorate([
    (0, typeorm_1.Entity)()
], Subject);
exports.Subject = Subject;
class SubjectModel extends model_1.Model {
}
exports.SubjectModel = SubjectModel;
