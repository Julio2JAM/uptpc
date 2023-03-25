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
exports.EmployeeController = void 0;
const class_validator_1 = require("class-validator");
const employee_model_1 = require("../Models/employee.model");
const statusHttp_1 = require("../Base/statusHttp");
class EmployeeController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employeeModel = new employee_model_1.EmployeeModel();
                const employee = yield employeeModel.get(employee_model_1.Employee);
                if (!employee) {
                    console.log("no data found for employee");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "No employee found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(employee);
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
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "id is required", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const employeeModel = new employee_model_1.EmployeeModel();
                const employee = employeeModel.getById(employee_model_1.Employee, id);
                if (!employee) {
                    console.log("no data found for employee");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ "message": "No employee found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(employee);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataEmployee = new Map(Object.entries(req.body));
                const newEmployee = new employee_model_1.Employee(dataEmployee);
                const errors = yield (0, class_validator_1.validate)(newEmployee);
                if (errors.length > 0) {
                    console.log("Invalid data passed for employee");
                    const message = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const employeeModel = new employee_model_1.EmployeeModel();
                const employee = yield employeeModel.create(employee_model_1.Employee, newEmployee);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(employee);
            }
            catch (error) {
                console.log(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": "Something went wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
