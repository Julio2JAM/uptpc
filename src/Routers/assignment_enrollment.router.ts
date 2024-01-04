import { Router } from "express";
import { Assignment_enrollmentController } from "../Controllers/assignment_enrollment.controller";

const router = Router();
const controller = new Assignment_enrollmentController();

router.get('/', controller.get)
router.post('/', controller.post)
router.put('/', controller.put);

export default router;