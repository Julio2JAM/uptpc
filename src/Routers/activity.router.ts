import { Router } from "express";
import { ActivityController } from "../Controllers/activity.controller";

const router = Router();
const controller = new ActivityController();

router.get('/', controller.get)
router.get('/:id', controller.getById)
router.post('/', controller.post)

export default router;