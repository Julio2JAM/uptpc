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
const class_validator_1 = require("class-validator");
const statusHttp_1 = require("../Base/statusHttp");
class UserController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.get(user_model_1.User);
                if (user.length === 0) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: 'not users found', status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(user);
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
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ "message": 'id is requered', status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                if (typeof id !== "number") {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ message: "The id is not a number", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.getById(user_model_1.User, id);
                if (!user) {
                    console.log("no data found");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ "message": 'not users found', status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ "message": 'something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Se obtienen los datos del req y se usa el constructor para asignarlos
                const { id_level, username, password } = req.body;
                const newUser = new user_model_1.User(id_level, username, password);
                //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
                const errors = yield (0, class_validator_1.validate)(newUser);
                if (errors.length > 0) {
                    const messages = errors.map(({ constraints }) => Object.values(constraints)).flat();
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ messages, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.create(user_model_1.User, newUser);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, id_level, username, password } = req.body;
                if (!id) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).send({ "message": 'id is requered', "status": statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                //const newUser = new User(username,password);
                const userModel = new user_model_1.UserModel();
                const userToUpdate = yield userModel.getById(user_model_1.User, Number(id));
                if (!userToUpdate) {
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ "message": 'User not found', "status": statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                if (id_level) {
                    userToUpdate.id_level = id_level;
                }
                if (username) {
                    userToUpdate.username = username;
                }
                if (password) {
                    userToUpdate.password = password;
                }
                const user = yield userModel.create(user_model_1.User, userToUpdate);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(user);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: 'something was wrong', status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.UserController = UserController;
