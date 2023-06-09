import { EnrollmentController } from "../Controllers/enrollment.controller";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/', controller.get);
router.get('/', controller.getById);
router.get('/classroom/:classroom?/student/:student?', controller.getByParams);
router.post('/', controller.post);

export default router;