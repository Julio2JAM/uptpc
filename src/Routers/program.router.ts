import { ProgramController } from "../Controllers/program.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ProgramController();

router.get('/pdf', controller.pdf);

router.get('/', authMiddleware, async (req, res) => {
    const response = await controller.get(req);
    return res.status(response.status).json(response.response);
});
router.post('/', controller.post);
router.put('/', controller.put);

export default router;