import { Router } from "express";
import { ProfessorController } from "../Controllers/professor.controller";

const router = Router();
const controller = new ProfessorController();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;