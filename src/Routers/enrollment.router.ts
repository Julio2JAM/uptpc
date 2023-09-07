import { EnrollmentController } from "../Controllers/enrollment.controller";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/', controller.get);
router.get('/program/', controller.get);
router.get('/studentNoClassroom/', controller.studentNoClassroom);
router.post('/', controller.post);

export default router;