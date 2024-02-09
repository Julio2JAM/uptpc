import { ProgramController } from "../Controllers/program.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ProgramController();

router.get('/', authMiddleware, controller.get);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;