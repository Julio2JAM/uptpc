import { AssignmentGradeController } from "../Controllers/evaluation.controller";
import { Router } from "express";

const router = Router();
const controller = new AssignmentGradeController();

router.get('/', controller.get);
router.post('/', controller.post);

export default router;