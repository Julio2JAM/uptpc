"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_controller_1 = require("../Controllers/program.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = new program_controller_1.ProgramController();
router.get('/', controller.get);
router.post('/', controller.post);
exports.default = router;
