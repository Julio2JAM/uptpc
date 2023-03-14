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
class UserController {
    get(_err, _req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userModel = new user_model_1.UserModel();
                const user = yield userModel.get();
                console.log(user);
                return res.status(200).json(user);
            }
            catch (err) {
                console.error(err);
                return res.status(404).send({ "message": 'not users found', "status": 404 });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userModel = new user_model_1.UserModel();
                const id = req.params.id;
                const user = yield userModel.getById(Number(id));
                return res.status(200).json(user);
            }
            catch (err) {
                console.error(err);
                return res.status(404).send({ "message": 'not users found', "status": 404 });
            }
        });
    }
}
exports.UserController = UserController;
