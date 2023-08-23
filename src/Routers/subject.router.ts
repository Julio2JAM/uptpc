import { Router } from "express";
import { SubjectController } from "../Controllers/subject.controller";
import { dataValidator } from "../middlewares/dataValidator";
import { Subject } from "../Models/subject.model";

const router = Router();
const controller = new SubjectController();

router.get('/', (req, res, next) => dataValidator(Subject, req, res, next), controller.get);
router.get('/:id', (req, res, next) => dataValidator(Subject, req, res, next), controller.getById);
router.get('/name/:name?/description/:description?/status/:status?',controller.getByParams);
router.post('/', (req, res, next) => dataValidator(Subject, req, res, next), controller.post);
router.put('/',controller.update);

export default router;