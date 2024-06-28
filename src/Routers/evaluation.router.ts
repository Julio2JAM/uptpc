import { EvaluationController } from "../Controllers/evaluation.controller";
import { Router } from "express";

const router = Router();
const controller = new EvaluationController();

router.get('/', controller.get);
router.get('/assignmentEntries', controller.getByAssignmentEntries);
router.post('/', controller.post);
router.post('/all', controller.postAll);
router.put('/', controller.put);

export default router;