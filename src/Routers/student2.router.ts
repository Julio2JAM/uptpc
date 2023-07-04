import { Router } from "express";
import { Student2Controller } from "../Controllers/student2.controller";

const router = Router();
const controller = new Student2Controller();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;