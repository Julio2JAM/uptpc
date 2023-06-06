import { Router } from "express";
import { AccessController } from "../Controllers/access.controller";

const router = Router();
const controller = new AccessController();

router.get('/', controller.get);
router.get('/verifyToken/:token', controller.verifyToken);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;