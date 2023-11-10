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
exports.RoleController = void 0;
const role_model_1 = require("../Models/role.model");
const statusHttp_1 = require("../Base/statusHttp");
const toolkit_1 = require("../Base/toolkit");
const typeorm_1 = require("typeorm");
class RoleController {
    get(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = {
                    name: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.name) && (0, typeorm_1.Like)(`%${req.query.name}%`),
                    id_status: (_b = req.query) === null || _b === void 0 ? void 0 : _b.id_status
                };
                const roleModel = new role_model_1.RoleModel();
                const role = yield roleModel.get(role_model_1.Role, { where: (0, toolkit_1.removeFalsyFromObject)(where) });
                if (role.length == 0) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "Role not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(role);
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
                const newLevel = new role_model_1.Role(req.body);
                const errors = yield (0, toolkit_1.validation)(newLevel);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const roleModel = new role_model_1.RoleModel();
                const role = yield roleModel.create(role_model_1.Role, newLevel);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(role);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const roleModel = new role_model_1.RoleModel();
                let roleToUpdate = roleModel.getById(role_model_1.Role, req.body.id);
                if (!roleToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "invalid data", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const newRole = new role_model_1.Role(req.body);
                roleToUpdate = Object.assign(roleToUpdate, newRole);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(roleToUpdate);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.RoleController = RoleController;
