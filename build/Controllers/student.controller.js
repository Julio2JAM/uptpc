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
const class_validator_1 = require("class-validator");
const student_model_1 = require("../Models/student.model");
const statusHttp_1 = require("../Base/statusHttp");
class StudentController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentModel = new student_model_1.StudentModel();
                const students = yield studentModel.get(student_model_1.Student);
                console.log(students);
                if (students.length == 0) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No student found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(students);
            }
            catch (error) {
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Is is requiered", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const studentModel = new student_model_1.StudentModel();
                const student = yield studentModel.getById(student_model_1.Student, id);
                if (!student) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No student found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(student);
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
                const dataStudent = new Map(Object.entries(req.body));
                const newStudent = new student_model_1.Student(dataStudent);
                const errors = yield (0, class_validator_1.validate)(newStudent);
                if (errors.length > 0) {
                    const message = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const studentModel = new student_model_1.StudentModel();
                const student = yield studentModel.create(student_model_1.Student, newStudent);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(student);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "id is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const studentModel = new student_model_1.StudentModel();
                const student = yield studentModel.getById(student_model_1.Student, id);
                if (!student) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Student not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                //no terminado
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(student);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.StudentController = StudentController;
