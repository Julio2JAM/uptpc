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
exports.CalificationController = void 0;
const calification_model_1 = require("../Models/calification.model");
const statusHttp_1 = require("../Base/statusHttp");
const toolkit_1 = require("../Base/toolkit");
const model_1 = require("../Base/model");
const program_model_1 = require("../Models/program.model");
const enrollment_model_1 = require("../Models/enrollment.model");
class CalificationController {
    get(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    program: {
                        classroom: true,
                        subject: true,
                        professor: {
                            person: true
                        },
                    },
                    enrollment: {
                        classroom: true,
                        student: {
                            person: true,
                            representative1: true,
                            representative2: true,
                        },
                    },
                };
                const where = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    grade: (_b = req.query) === null || _b === void 0 ? void 0 : _b.grade,
                    id_status: (_c = req.query) === null || _c === void 0 ? void 0 : _c.id_status,
                    program: {
                        id: (_d = req.query) === null || _d === void 0 ? void 0 : _d.idProgram
                    },
                    enrollment: {
                        id: (_e = req.query) === null || _e === void 0 ? void 0 : _e.idEnrollment
                    },
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const calificationModel = new calification_model_1.CalificationModel();
                const calification = yield calificationModel.get(calification_model_1.Calification, findData);
                if (calification.length === 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Calification not founds", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(calification);
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
                if (!req.body.program && !req.body.enrollment) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                req.body.program = yield model.getById(program_model_1.Program, Number(req.body.program));
                req.body.enrollment = yield model.getById(enrollment_model_1.Enrollment, Number(req.body.enrollment), ["student"]);
                if (!req.body.program && !req.body.enrollment) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const calificationModel = new calification_model_1.CalificationModel();
                const grade = yield calificationModel.calculateGrade(req.body.program.id, req.body.enrollment.student.id);
                req.body.grade = Number(grade.grade).toFixed(2);
                const newCalification = new calification_model_1.Calification(req.body);
                const errors = yield (0, toolkit_1.validation)(newCalification);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const calification = yield model.create(calification_model_1.Calification, newCalification);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(calification);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const calificationModel = new calification_model_1.CalificationModel();
                const calificationToUpdate = yield calificationModel.getById(calification_model_1.Calification, req.body.id, ["program", "enrollment"]);
                if (!calificationToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Calification no found", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const grade = yield calificationModel.calculateGrade(req.body.program.id, req.body.enrollment.student.id);
                calificationToUpdate.grade = Number(grade.grade).toFixed(2);
                calificationToUpdate.id_status = (_b = req.body.id_status) !== null && _b !== void 0 ? _b : calificationToUpdate.id_status;
                const calification = calificationModel.create(calification_model_1.Calification, calificationToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(calification);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.CalificationController = CalificationController;
