import { Router } from "express";
import { SubjectController } from "../Controllers/subject.controller";
import { dataValidator } from "../middlewares/dataValidator";
import { Subject } from "../Models/subject.model";

const router = Router();
const controller = new SubjectController();

router.get('/pdf', controller.pdf);

router.get('/', async (req, res) => {
    const response = await controller.get(req);
    return res.status(response.status).json(response.response);
});

router.post('/', (req, res, next) => dataValidator(Subject, req, res, next), async (req, res) => {
    const response = await controller.post(req);
    return res.status(response.status).json(response.response);
});

router.put('/', async (req, res) => {
    const response = await controller.put(req);
    return res.status(response.status).json(response.response);
});

export default router;