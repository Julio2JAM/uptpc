import { Router } from "express";
import { LevelController } from "../Controllers/level.controller";

const router = Router();
const controller = new LevelController();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;