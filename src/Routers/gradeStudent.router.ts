import { GradeStudentController } from "../Controllers/gradeStudent.controller";
import { Router } from "express";

const router = Router();
const controller = new GradeStudentController();

router.get('/', controller.get);
router.get('/', controller.getById);
router.post('/', controller.post);

export default router;