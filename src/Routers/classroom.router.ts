import { Router } from "express";
import { ClassroomController } from "../Controllers/classroom.controller";

const router = Router();
const controller = new ClassroomController();

router.get('/pdf', controller.pdf);

router.get('/', async (req, res) => {
    const response = await controller.get(req);
    return res.status(response.status).json(response.response);
});

router.post("/",controller.post);
router.put("/",controller.put);

export default router;