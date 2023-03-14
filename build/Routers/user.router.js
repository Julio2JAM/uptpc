"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../Controllers/user.controller");
const router = express_1.default.Router();
const controller = new user_controller_1.UserController();
router.get('/', controller.get);
router.get('/:id', controller.getById);
exports.default = router;
