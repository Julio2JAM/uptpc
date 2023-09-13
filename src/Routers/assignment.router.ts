import { Router } from "express";
import { AssignmentController } from "../Controllers/assignment.controller";

const router = Router();
const controller = new AssignmentController();

router.get('/', controller.get)
router.post('/', controller.post)
router.put('/', controller.put);

export default router;