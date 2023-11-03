"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../Controllers/role.controller");
const router = (0, express_1.Router)();
const controller = new role_controller_1.RoleController();
router.get('/', controller.get);
router.post('/', controller.post);
exports.default = router;
