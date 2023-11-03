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
exports.UserController = void 0;
const user_model_1 = require("../Models/user.model");
const statusHttp_1 = require("../Base/statusHttp");
const toolkit_1 = require("../Base/toolkit");
const role_model_1 = require("../Models/role.model");
const model_1 = require("../Base/model");
const typeorm_1 = require("typeorm");
const person_model_1 = require("../Models/person.model");
class UserController {
    get(req, res) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const relations = {
                    role: true
                };
                const where = {
                    id: (_a = req.query) === null || _a === void 0 ? void 0 : _a.id,
                    username: ((_b = req.query) === null || _b === void 0 ? void 0 : _b.username) && (0, typeorm_1.Like)(`%${(_c = req.query) === null || _c === void 0 ? void 0 : _c.username}%`),
                    id_status: (_d = req.query) === null || _d === void 0 ? void 0 : _d.id_status,
                    role: {
                        id: (_e = req.query) === null || _e === void 0 ? void 0 : _e.idRole
                    },
                    person: {
                        id: (_f = req.query) === null || _f === void 0 ? void 0 : _f.person,
                    }
                };
                const findData = { relations: relations, where: (0, toolkit_1.removeFalsyFromObject)(where) };
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.get(user_model_1.User, findData);
                if (user.length === 0) {
                    console.log("no users found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: 'not users found', status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    validateUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.query.username) {
                    console.log("No username send");
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "No username found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.get(user_model_1.User, { where: { username: req.query.username } });
                return res.status(statusHttp_1.HTTP_STATUS.OK).send({ message: user[0] ? true : false, status: statusHttp_1.HTTP_STATUS.OK });
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Se valida que se haya enviado una password para procedeser a hashearse
                if (!req.body.password || req.body.password.length < 8 || req.body.password.length > 16) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid password", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                req.body.password = yield (0, toolkit_1.hashPassword)(req.body.password);
                if (req.body.role) {
                    const roleModel = new role_model_1.RoleModel();
                    const role = roleModel.getById(role_model_1.Role, req.body.role);
                    if (!role) {
                        return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid role id", "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                    req.body.role = role;
                }
                //Se obtienen los datos del req y se usa el constructor para asignarlos
                const newUser = new user_model_1.User(req.body);
                //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
                const errors = yield (0, toolkit_1.validation)(newUser);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: errors, "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.create(user_model_1.User, newUser);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Id is requered", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const model = new model_1.Model();
                const userToUpdate = yield model.getById(user_model_1.User, req.body.id, ["role", "person"]);
                if (!userToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: "User not found", status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                if (req.body.person) {
                    const person = model.getById(person_model_1.Person, req.body.person);
                    if (!person) {
                        return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Invalid data", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                    userToUpdate.person = person;
                }
                if (req.body.role) {
                    const role = yield model.getById(role_model_1.Role, req.body.id);
                    if (!role) {
                        res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "Role not found", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                    }
                    userToUpdate.role = role;
                }
                if (req.body.password) {
                    userToUpdate.password = yield (0, toolkit_1.hashPassword)(req.body.password);
                }
                const user = yield model.create(user_model_1.User, userToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.UserController = UserController;
