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
const assignmentGrade_model_1 = require("../Models/assignmentGrade.model");
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class AssignmentGradeController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignmentGradeModel = new assignmentGrade_model_1.AssignmentGradeModel();
                const assignmentGrade = yield assignmentGradeModel.get(assignmentGrade_model_1.AssignmentGrade);
                if (!assignmentGrade) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No AssignmentGrade found." });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(assignmentGrade);
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
                const assignmentGradeModel = new assignmentGrade_model_1.AssignmentGradeModel();
                const assignmentGrade = assignmentGradeModel.getById(assignmentGrade_model_1.AssignmentGrade, id);
                if (!assignmentGrade) {
                    console.log("No assignmentGrade found");
                    res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No assignmentGrade found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(assignmentGrade);
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
                const dataAssignmentGrade = new Map(Object.entries(req.body));
                const newAssignmentGrade = new assignmentGrade_model_1.AssignmentGrade(dataAssignmentGrade);
                const errors = yield (0, class_validator_1.validate)(newAssignmentGrade);
                if (errors.length > 0) {
                    console.log(errors);
                    const keys = errors.map(error => error.property);
                    const values = errors.map(({ constraints }) => Object.values(constraints));
                    const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                    console.log(message);
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignmentGradeModel = new assignmentGrade_model_1.AssignmentGradeModel();
                const assignmentGrade = yield assignmentGradeModel.post_validation(newAssignmentGrade);
                return res.status(assignmentGrade.status).json(assignmentGrade);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AssignmentGradeController = AssignmentGradeController;
