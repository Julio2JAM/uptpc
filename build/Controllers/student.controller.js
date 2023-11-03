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
exports.StudentController = void 0;
const student_model_1 = require("../Models/student.model");
const statusHttp_1 = require("../Base/statusHttp");
const model_1 = require("../Base/model");
const person_model_1 = require("../Models/person.model");
const typeorm_1 = require("typeorm");
const toolkit_1 = require("../Base/toolkit");
class StudentController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    person: true,
                    representative1: true,
                    representative2: true,
                };
                const where = {
                    id: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.id) && Number(req.query.id),
                    id_status: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.id_status) && Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.id_status),
                    person: {
                        id: ((_d = req.query) === null || _d === void 0 ? void 0 : _d.personId) && Number(req.query.personId),
                        name: ((_e = req.query) === null || _e === void 0 ? void 0 : _e.personName) && (0, typeorm_1.Like)(`%${(_f = req.query) === null || _f === void 0 ? void 0 : _f.personName}%`),
                        lastName: ((_g = req.query) === null || _g === void 0 ? void 0 : _g.personLastName) && (0, typeorm_1.Like)(`%${(_h = req.query) === null || _h === void 0 ? void 0 : _h.personLastName}%`),
                        cedule: ((_j = req.query) === null || _j === void 0 ? void 0 : _j.personCedule) && (0, typeorm_1.Like)(`%${(_k = req.query) === null || _k === void 0 ? void 0 : _k.personCedule}%`),
                        phone: ((_l = req.query) === null || _l === void 0 ? void 0 : _l.personPhone) && (0, typeorm_1.Like)(`%${(_m = req.query) === null || _m === void 0 ? void 0 : _m.personPhone}%`),
                    },
                    representative1: {
                        id: ((_o = req.query) === null || _o === void 0 ? void 0 : _o.representative1Id) && Number(req.query.representative1Id),
                        name: ((_p = req.query) === null || _p === void 0 ? void 0 : _p.representative1Name) && (0, typeorm_1.Like)(`%${(_q = req.query) === null || _q === void 0 ? void 0 : _q.representative1Name}%`),
                        lastName: ((_r = req.query) === null || _r === void 0 ? void 0 : _r.representative1LastName) && (0, typeorm_1.Like)(`%${(_s = req.query) === null || _s === void 0 ? void 0 : _s.representative1LastName}%`),
                        cedule: ((_t = req.query) === null || _t === void 0 ? void 0 : _t.representative1Cedule) && (0, typeorm_1.Like)(`%${(_u = req.query) === null || _u === void 0 ? void 0 : _u.representative1Cedule}%`),
                        phone: ((_v = req.query) === null || _v === void 0 ? void 0 : _v.representative1Phone) && (0, typeorm_1.Like)(`%${(_w = req.query) === null || _w === void 0 ? void 0 : _w.representative1Phone}%`),
                    },
                    representative2: {
                        id: ((_x = req.query) === null || _x === void 0 ? void 0 : _x.representative2Id) && Number(req.query.representative2Id),
                        name: ((_y = req.query) === null || _y === void 0 ? void 0 : _y.representative2Name) && (0, typeorm_1.Like)(`%${(_z = req.query) === null || _z === void 0 ? void 0 : _z.representative2Name}%`),
                        lastName: ((_0 = req.query) === null || _0 === void 0 ? void 0 : _0.representative2LastName) && (0, typeorm_1.Like)(`%${(_1 = req.query) === null || _1 === void 0 ? void 0 : _1.representative2LastName}%`),
                        cedule: ((_2 = req.query) === null || _2 === void 0 ? void 0 : _2.representative2Cedule) && (0, typeorm_1.Like)(`%${(_3 = req.query) === null || _3 === void 0 ? void 0 : _3.representative2Cedule}%`),
                        phone: ((_4 = req.query) === null || _4 === void 0 ? void 0 : _4.representative2Phone) && (0, typeorm_1.Like)(`%${(_5 = req.query) === null || _5 === void 0 ? void 0 : _5.representative2Phone}%`),
                    },
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const studentModel = new student_model_1.StudentModel();
                const student = yield studentModel.get(student_model_1.Student, findData);
                if (student.length == 0) {
                    console.log("No students found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No students found.", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(student);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "No id send", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const studentModel = new student_model_1.StudentModel();
                const studentToUpdate = yield studentModel.getById(student_model_1.Student, req.body.id, ["person", "representative1", "representative2"]);
                if (!studentToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Student no fund", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const updatable = [
                    "person",
                    "representative1",
                    "representative2",
                ];
                for (const key in studentToUpdate) {
                    if (!updatable.includes(key) || !req.body[key] && key == "person" || typeof req.body[key] !== "object") {
                        continue;
                    }
                    if (Object.entries(req.body[key]).length == 0 && req.body[key] !== undefined) {
                        studentToUpdate[key] = null;
                    }
                    else if (!req.body[key].id && Object.entries(studentToUpdate[key]).length > 0) {
                        studentToUpdate[key] = Object.assign(studentToUpdate[key], req.body[key]);
                    }
                }
                const student = yield studentModel.create(student_model_1.Student, studentToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(student);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.person) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Incorret data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                for (const key in req.body) {
                    if (Object.entries(req.body[key]).length == 0) {
                        continue;
                    }
                    const newPerson = new person_model_1.Person(req.body[key]);
                    req.body[key] = yield model.create(person_model_1.Person, newPerson);
                    if (!req.body[key]) {
                        return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Incorret data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                }
                const studentModel = new student_model_1.StudentModel();
                const newStudent = new student_model_1.Student(req.body);
                const student = yield studentModel.create(student_model_1.Student, newStudent);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(student);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.StudentController = StudentController;
