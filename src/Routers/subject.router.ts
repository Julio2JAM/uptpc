import { Router } from "express";
import { SubjectController } from "../Controllers/subject.controller";
import { dataValidator } from "../middlewares/dataValidator";
import { Subject } from "../Models/subject.model";

const router = Router();
const controller = new SubjectController();

router.get('/pdf', controller.pdf);
// router.get('/', async (req, res) => {
//     const response = await controller.get(req, res);
//     return res.status(response.status).json(response.response);
// });
router.get('/', controller.get);
router.post('/', (req, res, next) => dataValidator(Subject, req, res, next), controller.post);
router.put('/',controller.put);

export default router;