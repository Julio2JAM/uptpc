import { EnrollmentController } from "../Controllers/Enrollment.controller";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/', controller.get);
router.get('/', controller.getById);
router.post('/', controller.post);

export default router;