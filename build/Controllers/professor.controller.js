"use strict";
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
exports.ProfessorController = void 0;
const professor_model_1 = require("../Models/professor.model");
const statusHttp_1 = require("../Base/statusHttp");
const person_model_1 = require("../Models/person.model");
const toolkit_1 = require("../Base/toolkit");
const typeorm_1 = require("typeorm");
class ProfessorController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    person: true,
                };
                const where = {
                    id: req.query.id,
                    id_status: req.query.id_status,
                    person: {
                        cedule: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.cedule) && (0, typeorm_1.Like)(`%${Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.cedule)}%`),
                        name: ((_c = req.query) === null || _c === void 0 ? void 0 : _c.name) && (0, typeorm_1.Like)(`%${(_d = req.query) === null || _d === void 0 ? void 0 : _d.name}%`),
                        lastName: ((_e = req.query) === null || _e === void 0 ? void 0 : _e.lastName) && (0, typeorm_1.Like)(`%${(_f = req.query) === null || _f === void 0 ? void 0 : _f.lastName}%`),
                        phone: ((_g = req.query) === null || _g === void 0 ? void 0 : _g.phone) && (0, typeorm_1.Like)(`%${(_h = req.query) === null || _h === void 0 ? void 0 : _h.phone}%`),
                        email: ((_j = req.query) === null || _j === void 0 ? void 0 : _j.email) && (0, typeorm_1.Like)(`%${(_k = req.query) === null || _k === void 0 ? void 0 : _k.email}%`),
                        birthday: typeof ((_l = req.query) === null || _l === void 0 ? void 0 : _l.birthday) === "string" ? new Date(req.query.birthday) : undefined,
                    },
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const professorModel = new professor_model_1.ProfessorModel();
                const professor = yield professorModel.get(professor_model_1.Professor, findData);
                if (professor.length == 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Professors not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(professor);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data" });
                }
                const professorModel = new professor_model_1.ProfessorModel();
                const professorToUpdate = yield professorModel.getById(professor_model_1.Professor, req.body.id, ["person"]);
                if (!professorToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Professor not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const personModel = new person_model_1.PersonModel();
                if (req.body.idPerson) {
                    professorToUpdate.person = yield personModel.getById(person_model_1.Person, req.body.idPerson);
                }
                else if ((_a = professorToUpdate.person) === null || _a === void 0 ? void 0 : _a.id) {
                    professorToUpdate.person = Object.assign(professorToUpdate.person, req.body.person);
                }
                else {
                    professorToUpdate.person = new person_model_1.Person(req.body.person);
                }
                const professor = yield professorModel.create(professor_model_1.Professor, professorToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(professor);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.person && !req.body.idPerson) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data" });
                }
                const personModel = new person_model_1.PersonModel();
                const newPerson = new person_model_1.Person(req.body.idPerson ? yield personModel.getById(person_model_1.Person, Number(req.body.idPerson)) : req.body.person);
                const errors = yield (0, toolkit_1.validation)(newPerson);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const professorModel = new professor_model_1.ProfessorModel();
                const newProfessor = new professor_model_1.Professor(req.body);
                const professor = yield professorModel.create(professor_model_1.Professor, newProfessor);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(professor);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.ProfessorController = ProfessorController;
