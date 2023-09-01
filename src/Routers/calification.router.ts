import { Router } from "express";
import { SubjectGradeController } from "../Controllers/calification.controller";

const router = Router();
const controller = new SubjectGradeController();

router.get('/', controller.get);
router.post('/', controller.post);

export default router;