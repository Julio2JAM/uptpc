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
exports.ClassroomProfessorController = void 0;
const classroomProfessor_model_1 = require("../Models/classroomProfessor.model");
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class ClassroomProfessorController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classroomProfessorModel = new classroomProfessor_model_1.ClassroomProfessorModel();
                const classroomProfessor = yield classroomProfessorModel.get(classroomProfessor_model_1.ClassroomProfessor);
                if (classroomProfessor.length == 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No classroomProfessor found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(classroomProfessor);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid id", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const classroomProfessorModel = new classroomProfessor_model_1.ClassroomProfessorModel();
                const classroomProfessor = yield classroomProfessorModel.getById(classroomProfessor_model_1.ClassroomProfessor, id);
                if (!classroomProfessor) {
                    console.log("No classroomProfessor found");
                    res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No classroomProfessor found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(classroomProfessor);
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
                const dcp = new Map(Object.entries(req.body));
                const newCP = new classroomProfessor_model_1.ClassroomProfessor(dcp);
                const errors = yield (0, class_validator_1.validate)(newCP);
                if (errors.length > 0) {
                    console.log(errors);
                    const keys = errors.map(error => error.property);
                    const values = errors.map(({ constraints }) => Object.values(constraints));
                    const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                    console.log(message);
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    //const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                }
                const cpm = new classroomProfessor_model_1.ClassroomProfessorModel();
                const cp = yield cpm.post_validation(newCP);
                return res.status(cp.status).json(cp);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.ClassroomProfessorController = ClassroomProfessorController;
