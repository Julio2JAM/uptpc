import { EnrollmentController } from "../Controllers/enrollment.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/', authMiddleware, controller.get);
router.get('/program/', authMiddleware, controller.getProgram);
router.get('/studentNoClassroom/', controller.studentNoClassroom);
router.post('/', controller.post);

export default router;