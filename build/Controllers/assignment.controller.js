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
exports.AssignmentController = void 0;
const assignment_model_1 = require("../Models/assignment.model");
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class AssignmentController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignmentModel = new assignment_model_1.AssignmentModel();
                const assignment = yield assignmentModel.get(assignment_model_1.Assignment);
                if (assignment.length == 0) {
                    console.log("No assignment found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No Assignment found.", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(assignment);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Id is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignmentModel = new assignment_model_1.AssignmentModel();
                const assignment = yield assignmentModel.getById(assignment_model_1.Assignment, id);
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(assignment);
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
                const dataAssignment = new Map(Object.entries(req.body));
                const newAssignment = new assignment_model_1.Assignment(dataAssignment);
                const errors = yield (0, class_validator_1.validate)(newAssignment);
                if (errors.length > 0) {
                    console.log(errors);
                    const message = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ "message": message, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const assignmentModel = new assignment_model_1.AssignmentModel();
                const acitvity = yield assignmentModel.post_validation(newAssignment);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(acitvity);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AssignmentController = AssignmentController;
