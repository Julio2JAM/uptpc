import { Router } from "express";
import { Assignment_enrollmentController } from "../Controllers/assignment_enrollment.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new Assignment_enrollmentController();

router.get('/', controller.get)
router.post('/', authMiddleware, controller.post)
router.put('/', controller.put);

export default router;