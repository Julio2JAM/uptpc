import { EvaluationController } from "../Controllers/evaluation.controller";
import { Router } from "express";

const router = Router();
const controller = new EvaluationController();

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;