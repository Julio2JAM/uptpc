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
exports.SubjectController = void 0;
const class_validator_1 = require("class-validator");
const subject_model_1 = require("../Models/subject.model");
const statusHttp_1 = require("../Base/statusHttp");
class SubjectController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subjectModel = new subject_model_1.SubjectModel();
                const subject = yield subjectModel.get(subject_model_1.Subject);
                if (subject.length == 0) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: 'not users found', "status": statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid id", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const subjectModel = new subject_model_1.SubjectModel();
                const subject = yield subjectModel.getById(subject_model_1.Subject, id);
                if (!subject) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Subject not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name /*, code*/ } = req.body;
                const newSubject = new subject_model_1.Subject(name /*, code*/);
                const errors = yield (0, class_validator_1.validate)(newSubject);
                if (errors.length > 0) {
                    const message = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, "status": "HTTP_STATUS.BAD_RESQUEST" });
                }
                const subjectModel = new subject_model_1.SubjectModel();
                const subject = yield subjectModel.create(subject_model_1.Subject, newSubject);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name } = req.body;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: 'id is requered', "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const subjectModel = new subject_model_1.SubjectModel();
                const subjectToUpdate = yield subjectModel.getById(subject_model_1.Subject, Number(id));
                if (!subjectToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Subject not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                if (name) {
                    subjectToUpdate.name = name;
                }
                const subject = yield subjectModel.create(subject_model_1.Subject, subjectToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(subject);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'Something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.SubjectController = SubjectController;
