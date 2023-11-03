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
exports.AssignmentController = void 0;
const assignment_model_1 = require("../Models/assignment.model");
const statusHttp_1 = require("../Base/statusHttp");
const toolkit_1 = require("../Base/toolkit");
const program_model_1 = require("../Models/program.model");
const typeorm_1 = require("typeorm");
class AssignmentController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    program: {
                        classroom: true,
                        subject: true,
                        professor: {
                            person: true
                        },
                    }
                };
                const where = {
                    program: {
                        id: req.query.idProgram,
                        classroom: {
                            id: req.query.idClassroom
                        },
                        professor: {
                            id: req.query.idProfessor
                        },
                        subject: {
                            id: req.query.idSubject
                        },
                    },
                    name: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.name) && (0, typeorm_1.Like)(`%${req.query.name}%`),
                    description: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.description) && (0, typeorm_1.Like)(`%${req.query.description}%`),
                    porcentage: ((_c = req.query) === null || _c === void 0 ? void 0 : _c.porcentage) && Number(req.query.porcentage),
                    quantity: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.quantity) && Number(req.query.quantity),
                    datetime_end: (_e = req.query) === null || _e === void 0 ? void 0 : _e.datetime_end,
                    id_status: (_f = req.query) === null || _f === void 0 ? void 0 : _f.id_status,
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const assignmentModel = new assignment_model_1.AssignmentModel();
                const assignment = yield assignmentModel.get(assignment_model_1.Assignment, findData);
                if (assignment.length == 0) {
                    console.log("No assignment found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No Assignment found.", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(assignment);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.program)) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "No program send", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const programModel = new program_model_1.ProgramModel();
                const programRelations = {
                    professor: {
                        person: true
                    },
                    classroom: true,
                    subject: true
                };
                req.body.program = yield programModel.getById(program_model_1.Program, req.body.program, programRelations);
                if (!req.body.program) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid program", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignmentModel = new assignment_model_1.AssignmentModel();
                if (req.body.porcentage) {
                    const porcentage = yield assignmentModel.calculatePorcentage(req.body.program.id);
                    if (porcentage && Number(req.body.porcentage) > porcentage.porcentage) {
                        return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: `Porcenge valid: ${porcentage.porcentage}`, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                }
                const newAssignment = new assignment_model_1.Assignment(req.body);
                const errors = yield (0, toolkit_1.validation)(newAssignment);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignment = yield assignmentModel.create(assignment_model_1.Assignment, newAssignment);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(assignment);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignmentModel = new assignment_model_1.AssignmentModel();
                let assignmentToUpdate = yield assignmentModel.getById(assignment_model_1.Assignment, req.body.id, ["program"]);
                delete req.body.id;
                if (!assignmentToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "No assignment fund", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (req.body.porcentage) {
                    const porcentage = yield assignmentModel.calculatePorcentage(assignmentToUpdate.program.id);
                    if (porcentage && Number(req.body.porcentage) > porcentage.porcentage && req.body.porcentage > assignmentToUpdate.porcentage) {
                        return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: `Porcenge valid: ${porcentage.porcentage}`, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                }
                assignmentToUpdate = Object.assign(assignmentToUpdate, req.body);
                const assignment = yield assignmentModel.create(assignment_model_1.Assignment, assignmentToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(assignment);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AssignmentController = AssignmentController;
