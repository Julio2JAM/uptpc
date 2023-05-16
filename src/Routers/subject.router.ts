import { SubjectController } from "../Controllers/subject.controller";
import { Router } from "express";

const router = Router();
const controller = new SubjectController();

router.get('/',controller.get);
router.post('/postOrUpdate',controller.postOrUpdate);
router.get('/:id',controller.getById);
router.get('/name/:name',controller.getByName);
router.post('/',controller.post);
router.put('/',controller.update);

export default router;