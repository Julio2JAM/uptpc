import { EnrollmentController } from "../Controllers/enrollment.controller";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/', controller.get);
//router.get('/person/:id_student', controller.getStudent);
router.get('/classroom/:id_classroom', controller.getStudent);
router.post('/', controller.post);

export default router;