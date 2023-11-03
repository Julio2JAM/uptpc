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
exports.EnrollmentController = void 0;
const enrollment_model_1 = require("../Models/enrollment.model");
const statusHttp_1 = require("../Base/statusHttp");
const classroom_model_1 = require("../Models/classroom.model");
const student_model_1 = require("../Models/student.model");
const model_1 = require("../Base/model");
const typeorm_1 = require("typeorm");
const program_model_1 = require("../Models/program.model");
const toolkit_1 = require("../Base/toolkit");
class EnrollmentController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    classroom: true,
                    student: {
                        person: true,
                        representative1: true,
                        representative2: true,
                    },
                };
                const where = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    id_status: (_b = req.query) === null || _b === void 0 ? void 0 : _b.idStatus,
                    student: {
                        id: (_c = req.query) === null || _c === void 0 ? void 0 : _c.idStudent,
                        person: {
                            id: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.personId) && Number(req.query.personId),
                            name: ((_e = req.query) === null || _e === void 0 ? void 0 : _e.personName) && (0, typeorm_1.Like)(`%${(_f = req.query) === null || _f === void 0 ? void 0 : _f.personName}%`),
                            lastName: ((_g = req.query) === null || _g === void 0 ? void 0 : _g.personLastName) && (0, typeorm_1.Like)(`%${(_h = req.query) === null || _h === void 0 ? void 0 : _h.personLastName}%`),
                            cedule: ((_j = req.query) === null || _j === void 0 ? void 0 : _j.personCedule) && (0, typeorm_1.Like)(`%${(_k = req.query) === null || _k === void 0 ? void 0 : _k.personCedule}%`),
                            phone: ((_l = req.query) === null || _l === void 0 ? void 0 : _l.personPhone) && (0, typeorm_1.Like)(`%${(_m = req.query) === null || _m === void 0 ? void 0 : _m.personPhone}%`),
                        }
                    },
                    classroom: {
                        id: (_o = req.query) === null || _o === void 0 ? void 0 : _o.idClassroom,
                        name: ((_p = req.query) === null || _p === void 0 ? void 0 : _p.name) && (0, typeorm_1.Like)(`%${(_q = req.query) === null || _q === void 0 ? void 0 : _q.name}%`),
                        datetime_start: (_r = req.query) === null || _r === void 0 ? void 0 : _r.datetime_start,
                        datetime_end: (_s = req.query) === null || _s === void 0 ? void 0 : _s.datetime_end,
                    },
                };
                const findData = { relations: relations, where: where };
                const enrollmentModel = new enrollment_model_1.EnrollmentModel();
                const enrollment = yield enrollmentModel.get(enrollment_model_1.Enrollment, findData);
                if (enrollment.length == 0) {
                    console.log("No Enrollment found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No Enrollment found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(enrollment);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    studentNoClassroom(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrollmentModel = new enrollment_model_1.EnrollmentModel();
                const enrollment = yield enrollmentModel.studentNoClassroom();
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(enrollment);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getProgram(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.query.enrollment) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Enrollment is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                const enrollment = yield model.getById(enrollment_model_1.Enrollment, Number(req.query.enrollment), {
                    classroom: true,
                    student: {
                        person: true,
                        representative1: true,
                        representative2: true,
                    }
                });
                if (!enrollment) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid enrollment", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const relations = {
                    classroom: true,
                    subject: true,
                    professor: {
                        person: true
                    }
                };
                const where = {
                    classroom: {
                        id: enrollment.classroom.id
                    },
                    subject: {
                        name: req.query.subjectName
                    },
                    professor: {
                        person: {
                            name: req.query.professorName
                        }
                    }
                };
                const program = yield model.get(program_model_1.Program, {
                    relations: relations,
                    where: (0, toolkit_1.removeFalsyFromObject)(where)
                });
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(program);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const enrollmentModel = new enrollment_model_1.EnrollmentModel();
                const enrollmentToUpdate = yield enrollmentModel.getById(enrollment_model_1.Enrollment, req.body.id, ["student", "classroom"]);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(enrollmentToUpdate);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    student: (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.student) === null || _b === void 0 ? void 0 : _b.id,
                    classroom: (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.classroom) === null || _d === void 0 ? void 0 : _d.id,
                };
                if (!data.classroom || !data.student) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                data.student = yield model.getById(student_model_1.Student, data.student);
                data.classroom = yield model.getById(classroom_model_1.Classroom, data.classroom);
                if (!data.student || !data.classroom) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const newEnrollment = new enrollment_model_1.Enrollment(data);
                const enrollment = yield model.create(enrollment_model_1.Enrollment, newEnrollment);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(enrollment);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.EnrollmentController = EnrollmentController;
