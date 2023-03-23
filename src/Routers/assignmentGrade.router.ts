import { AssignmentGradeController } from "../Controllers/assignmentGrade.controller";
import { Router } from "express";

const router = Router();
const controller = new AssignmentGradeController();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;