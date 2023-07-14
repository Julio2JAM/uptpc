import { Router } from "express";
import { AssignmentController } from "../Controllers/assignment.controller";

const router = Router();
const controller = new AssignmentController();

router.get('/', controller.get)
router.get('/:id', controller.getById)
router.get('/program/:id', controller.getByProgram)
router.post('/', controller.post)

export default router;