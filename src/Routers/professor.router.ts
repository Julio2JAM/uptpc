import { Router } from "express";
import { ProfessorController } from "../Controllers/professor.controller";

const router = Router();
const controller = new ProfessorController();

router.get('/pdf', controller.pdf);

router.get('/', async (req, res) => {
    const response = await controller.get(req);
    return res.status(response.status).json(response.response);
});

router.put('/', controller.put);
router.post('/', controller.post);

export default router;