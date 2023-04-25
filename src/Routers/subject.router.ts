import { SubjectController } from "../Controllers/subject.controller";
import { Router } from "express";

const router = Router();
const controller = new SubjectController();

router.get('/',controller.get);
router.get('/:id',controller.getById);
router.get('/name/:name',controller.getByName);
router.post('/',controller.post);
router.put('/',controller.update);

export default router;