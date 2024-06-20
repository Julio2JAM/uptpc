import { Router } from "express";
import { Assignment_entryController } from "../Controllers/assignment_entry.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new Assignment_entryController();

router.get('/', controller.get)
router.get('/assignment_students', authMiddleware, controller.assignment_students)
router.post('/', authMiddleware, controller.post)
router.put('/', controller.put);

export default router;