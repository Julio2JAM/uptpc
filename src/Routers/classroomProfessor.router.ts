import { ClassroomProfessorController } from "../Controllers/classroomProfessor.controller";
import { Router } from "express";

const router = Router();
const controller = new ClassroomProfessorController();

router.get('/',controller.get)
router.get('/:id',controller.getById)
router.post('/',controller.post)

export default router;