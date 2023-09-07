import { Router } from "express";
import { AccessController } from "../Controllers/access.controller";

const router = Router();
const controller = new AccessController();

router.get('/', controller.get);
router.get('/verifyToken/:token', controller.verifyToken);
router.post('/', controller.post);

export default router;