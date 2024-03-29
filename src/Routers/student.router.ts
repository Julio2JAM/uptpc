import { Router } from "express";
import { StudentController } from "../Controllers/student.controller";

const router = Router();
const controller = new StudentController();

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;