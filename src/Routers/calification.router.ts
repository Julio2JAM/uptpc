import { Router } from "express";
import { CalificationController } from "../Controllers/calification.controller";

const router = Router();
const controller = new CalificationController();

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;