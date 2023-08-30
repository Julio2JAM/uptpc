import { ProgramController } from "../Controllers/program.controller";
import { Router } from "express";

const router = Router();
const controller = new ProgramController();

router.get('/',controller.get)
router.post('/',controller.post)

export default router;