"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const professor_controller_1 = require("../Controllers/professor.controller");
const router = (0, express_1.Router)();
const controller = new professor_controller_1.ProfessorController();
router.get('/', controller.get);
router.put('/', controller.put);
router.post('/', controller.post);
exports.default = router;
