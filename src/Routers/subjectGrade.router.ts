import { Router } from "express";
import { SubjectGradeController } from "../Controllers/subjectGrade.controller";

const router = Router();
const controller = new SubjectGradeController();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;