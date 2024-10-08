import { EnrollmentController } from "../Controllers/enrollment.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Router } from "express";

const router = Router();
const controller = new EnrollmentController();

router.get('/pdf', controller.pdf);

router.get('/', authMiddleware, async (req, res) => {
    const response = await controller.get(req);
    return res.status(response.status).json(response.response);
});

router.get('/program/', authMiddleware, controller.getProgram);
router.get('/studentNoClassroom/', controller.studentNoClassroom);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;