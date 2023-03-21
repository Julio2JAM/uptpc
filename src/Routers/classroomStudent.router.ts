import { ClassroomStudentController } from "../Controllers/classroomStudent.controller";
import { Router } from "express";

const router = Router();
const controller = new ClassroomStudentController();

router.get('/', controller.get);
router.get('/', controller.getById);
router.post('/', controller.post);

export default router;