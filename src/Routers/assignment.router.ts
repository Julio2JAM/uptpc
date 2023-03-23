import { Router } from "express";
import { AssignmentController } from "../Controllers/assignment.controller";

const router = Router();
const controller = new AssignmentController();

router.get('/', controller.get)
router.get('/:id', controller.getById)
router.post('/', controller.post)

export default router;