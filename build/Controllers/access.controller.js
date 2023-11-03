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
exports.AccessController = void 0;
const access_model_1 = require("../Models/access.model");
const statusHttp_1 = require("../Base/statusHttp");
const user_model_1 = require("../Models/user.model");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const toolkit_1 = require("../Base/toolkit");
class AccessController {
    get(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessModel = new access_model_1.AccessModel();
                const access = yield accessModel.get(access_model_1.Access);
                if (access.length === 0) {
                    console.log("Access not founds");
                    return res.status(statusHttp_1.HTTP_STATUS.NOT_FOUND).send({ message: 'not access found', status: statusHttp_1.HTTP_STATUS.NOT_FOUND });
                }
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(access);
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
                if (!req.body.username || !req.body.password) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: "Password or username incorrect", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const userModel = new user_model_1.UserModel();
                const [user] = yield userModel.get(user_model_1.User, { where: { username: req.body.username } });
                if (!user) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: "Password or username incorrect", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const validatePassword = yield (0, toolkit_1.matchPassword)(req.body.password, user.password);
                if (!validatePassword) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: "Password or username incorrect", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const dataAccess = {
                    user: user,
                    token: (0, authMiddleware_1.generateToken)({ id: user.id })
                };
                const newAccess = new access_model_1.Access(dataAccess);
                const errors = yield (0, toolkit_1.validation)(newAccess);
                if (errors) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: errors, status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const accessModel = new access_model_1.AccessModel();
                const access = yield accessModel.create(access_model_1.Access, newAccess);
                console.log("Access: ", access);
                return res.status(statusHttp_1.HTTP_STATUS.CREATED).json(access);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
    verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                if (!token) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: "Token no send", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                const validateToken = (0, authMiddleware_1.verifyToken)(token);
                if (!validateToken.token) {
                    return res.status(statusHttp_1.HTTP_STATUS.UNAUTHORIZED).json(token);
                }
                const userModel = new user_model_1.UserModel();
                const user = userModel.getById(user_model_1.User, validateToken.user, ["role", "person"]);
                if (!user) {
                    return res.status(statusHttp_1.HTTP_STATUS.BAD_RESQUEST).json({ message: "Corrupt user", status: statusHttp_1.HTTP_STATUS.BAD_RESQUEST });
                }
                validateToken.user = user;
                return res.status(statusHttp_1.HTTP_STATUS.OK).json(validateToken);
            }
            catch (error) {
                console.error(error);
                return res.status(statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Something was wrong", status: statusHttp_1.HTTP_STATUS.INTERNAL_SERVER_ERROR });
            }
        });
    }
}
exports.AccessController = AccessController;
