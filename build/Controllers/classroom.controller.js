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
exports.ClassroomController = void 0;
const classroom_model_1 = require("../Models/classroom.model");
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class ClassroomController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classroomModel = new classroom_model_1.ClassroomModel();
                const classroom = yield classroomModel.get(classroom_model_1.Classroom);
                if (classroom.length == 0) {
                    console.log("No classroom found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No classroom founds", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(classroom);
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
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid id for classroom", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const classroomModel = new classroom_model_1.ClassroomModel();
                const classroom = yield classroomModel.getById(classroom_model_1.Classroom, id);
                if (!classroom) {
                    console.log("No classroom found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No classroom founds", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(classroom);
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
                const dataClassroom = new Map(Object.entries(req.body));
                const newClassroom = new classroom_model_1.Classroom(dataClassroom);
                const errors = yield (0, class_validator_1.validate)(newClassroom);
                if (errors.length > 0) {
                    console.log(errors);
                    const message = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: message, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const classroomModel = new classroom_model_1.ClassroomModel();
                const classroom = yield classroomModel.create(classroom_model_1.Classroom, newClassroom);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(classroom);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.ClassroomController = ClassroomController;
