import { StudentController } from "../Controllers/student.controller";
import { Router } from "express";
const router = Router();

const controller = new StudentController();

router.get('/',controller.get);
router.get('/:id',controller.getById);
router.post('/',controller.post);

export default router;