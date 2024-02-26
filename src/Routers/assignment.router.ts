import { Router } from "express";
import { AssignmentController } from "../Controllers/assignment.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new AssignmentController();

router.get('/', authMiddleware, controller.get)
router.post('/' , authMiddleware, controller.post)
router.put('/', controller.put);

export default router;