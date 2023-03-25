import { ClassroomSubjectController } from "../Controllers/classroomSubject.controller";
import { Router } from "express";

const router = Router();
const controller = new ClassroomSubjectController();

router.get('/',controller.get)
router.get('/:id',controller.getById)
router.post('/',controller.post)

export default router;