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
exports.AssignmentGradeController = void 0;
const evaluation_model_1 = require("../Models/evaluation.model");
const toolkit_1 = require("../Base/toolkit");
const statusHttp_1 = require("../Base/statusHttp");
const assignment_model_1 = require("../Models/assignment.model");
const enrollment_model_1 = require("../Models/enrollment.model");
const model_1 = require("../Base/model");
class AssignmentGradeController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    assignment: {
                        program: {
                            classroom: true,
                            subject: true,
                            professor: {
                                person: true
                            },
                        }
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
                    grade: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.grade) && Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.grade),
                    id_status: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.id_status) && Number((_e = req.query) === null || _e === void 0 ? void 0 : _e.grade),
                    assignment: {
                        id: (_f = req.query) === null || _f === void 0 ? void 0 : _f.idAssignment
                    },
                    enrollment: {
                        id: (_g = req.query) === null || _g === void 0 ? void 0 : _g.idEnrollment
                    },
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const evaluationModel = new evaluation_model_1.EvaluationModel();
                const evaluation = yield evaluationModel.get(evaluation_model_1.Evaluation, findData);
                if (evaluation.length == 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No evaluation found." });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(evaluation);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.assignment || !((_a = req.body) === null || _a === void 0 ? void 0 : _a.enrollment)) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: 'Invalid data', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                const assignmentRelations = {
                    program: {
                        classroom: true,
                        subject: true,
                        professor: {
                            person: true
                        },
                    }
                };
                req.body.assignment = yield model.getById(assignment_model_1.Assignment, req.body.assignment, assignmentRelations);
                const enrollmentRelations = {
                    classroom: true,
                    student: {
                        person: true,
                        representative1: true,
                        representative2: true,
                    },
                };
                req.body.enrollment = yield model.getById(enrollment_model_1.Enrollment, req.body.enrollment, enrollmentRelations);
                const newEvaluation = new evaluation_model_1.Evaluation(req.body);
                const error = yield (0, toolkit_1.validation)(newEvaluation);
                if (error) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ error: error, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const validateEvaluation = yield model.get(evaluation_model_1.Evaluation, {
                    assignment: req.body.assignment,
                    enrollment: req.body.enrollment,
                });
                if (validateEvaluation.length > 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ error: "Alrady exist", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (req.body.grade > req.body.assignment.base) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({
                        error: "Invalid grade",
                        min_grade: req.body.assignment.base,
                        status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST
                    });
                }
                const evaluationModel = new evaluation_model_1.EvaluationModel();
                const evaluation = yield evaluationModel.create(evaluation_model_1.Evaluation, newEvaluation);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(evaluation);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: 'Invalid data', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const evaluationModel = new evaluation_model_1.EvaluationModel();
                let evaluationToUpdate = yield evaluationModel.getById(evaluation_model_1.Evaluation, req.body.id, ["enrollment", "assignment"]);
                delete req.body.id;
                if (!evaluationToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: 'Invalid evaluation', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                evaluationToUpdate = Object.assign(evaluationToUpdate, req.body);
                const error = yield (0, toolkit_1.validation)(evaluationToUpdate);
                if (error) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ error: error, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const evaluation = yield evaluationModel.create(evaluation_model_1.Evaluation, evaluationToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(evaluation);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AssignmentGradeController = AssignmentGradeController;
