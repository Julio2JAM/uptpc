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
exports.SubjectGradeController = void 0;
const subjectGrade_model_1 = require("../Models/subjectGrade.model");
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class SubjectGradeController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subjectGradeModel = new subjectGrade_model_1.SubjectGradeModel();
                const subjectGrade = yield subjectGradeModel.get(subjectGrade_model_1.SubjectGrade);
                if (!subjectGrade) {
                    console.log("SubjectGrade not found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No SubjectGrade founds", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(subjectGrade);
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
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid id for subjectGrade", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const subjectGradeModel = new subjectGrade_model_1.SubjectGradeModel();
                const subjectGrade = yield subjectGradeModel.getById(subjectGrade_model_1.SubjectGrade, id);
                if (!subjectGrade) {
                    console.log("SubjectGrade not foun");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No SubjectGrade founds", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(subjectGrade);
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
                const dataSubjectGrade = new Map(Object.entries(req.body));
                const newSubjectGrade = new subjectGrade_model_1.SubjectGrade(dataSubjectGrade);
                const errors = yield (0, class_validator_1.validate)(newSubjectGrade);
                if (errors.length > 0) {
                    console.log(errors);
                    const keys = errors.map(error => error.property);
                    const values = errors.map(({ constraints }) => Object.values(constraints));
                    const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                    console.log(message);
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const subjectGradeModel = new subjectGrade_model_1.SubjectGradeModel();
                const subjectGrade = yield subjectGradeModel.post_validation(newSubjectGrade);
                return res.status(subjectGrade.status).json(subjectGrade);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.SubjectGradeController = SubjectGradeController;
