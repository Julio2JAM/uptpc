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
exports.ProgramController = void 0;
const program_model_1 = require("../Models/program.model");
const statusHttp_1 = require("../Base/statusHttp");
const model_1 = require("../Base/model");
const classroom_model_1 = require("../Models/classroom.model");
const Subject_1 = require("typeorm/persistence/Subject");
const professor_model_1 = require("../Models/professor.model");
const toolkit_1 = require("../Base/toolkit");
class ProgramController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    classroom: true,
                    subject: true,
                    professor: {
                        person: true
                    },
                };
                const where = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    classroom: {
                        id: (_b = req.query) === null || _b === void 0 ? void 0 : _b.idClassroom,
                        name: (_c = req.query) === null || _c === void 0 ? void 0 : _c.classroomName,
                    },
                    subject: {
                        id: (_d = req.query) === null || _d === void 0 ? void 0 : _d.idSubject,
                        name: (_e = req.query) === null || _e === void 0 ? void 0 : _e.subjectName,
                    },
                    professor: {
                        id: (_f = req.query) === null || _f === void 0 ? void 0 : _f.idProfessor,
                        person: {
                            name: (_g = req.query) === null || _g === void 0 ? void 0 : _g.professorName,
                        }
                    },
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const programModel = new program_model_1.ProgramModel();
                const program = yield programModel.get(program_model_1.Program, findData);
                if (program.length == 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No program found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(program);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.classroom && !req.params.subject && !req.params.professor) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: 'No data send', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                req.params.classroom = yield model.getById(classroom_model_1.Classroom, Number(req.params.classroom));
                req.params.subject = yield model.getById(Subject_1.Subject, Number(req.params.subject));
                req.params.professor = yield model.getById(professor_model_1.Professor, Number(req.params.professor));
                if (!req.params.classroom && !req.params.subject && !req.params.professor) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: 'No data send', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const newProgram = new program_model_1.Program(req.body);
                const programModel = new program_model_1.ProgramModel();
                const program = yield programModel.create(program_model_1.Program, newProgram);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(program);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.ProgramController = ProgramController;
