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
const toolkit_1 = require("../Base/toolkit");
const statusHttp_1 = require("../Base/statusHttp");
const typeorm_1 = require("typeorm");
class ClassroomController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    name: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.name) && (0, typeorm_1.Like)(`%${(_c = req.query) === null || _c === void 0 ? void 0 : _c.name}%`),
                    datetime_start: (_d = req.query) === null || _d === void 0 ? void 0 : _d.datetime_start,
                    datetime_end: (_e = req.query) === null || _e === void 0 ? void 0 : _e.datetime_end,
                    id_status: (_f = req.query) === null || _f === void 0 ? void 0 : _f.id_status,
                };
                const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));
                const classroomModel = new classroom_model_1.ClassroomModel();
                const classroom = yield classroomModel.get(classroom_model_1.Classroom, { where: whereOptions });
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
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newClassroom = new classroom_model_1.Classroom(req.body);
                if ((req.body.datetime_start && req.body.datetime_end) && (new Date(req.body.datetime_start) > new Date(req.body.datetime_end))) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Datetime start must be less than datetime end", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const errors = yield (0, toolkit_1.validation)(newClassroom);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
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
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "ID is requiered", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if ((req.body.datetime_start && req.body.datetime_end) && (new Date(req.body.datetime_start) > new Date(req.body.datetime_end))) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Datetime start must be less than datetime end", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const classroomModel = new classroom_model_1.ClassroomModel();
                let classroomToUpdate = yield classroomModel.getById(classroom_model_1.Classroom, req.body.id);
                delete req.body.id;
                if (!classroomToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Classroom not found", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                classroomToUpdate = Object.assign(classroomToUpdate, req.body);
                const classroom = yield classroomModel.create(classroom_model_1.Classroom, classroomToUpdate);
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
