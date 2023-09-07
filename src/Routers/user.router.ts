import { UserController } from "../Controllers/user.controller";
import { Router } from "express";
const router = Router();

const controller = new UserController();

router.get('/',controller.get);
router.get('/username/',controller.validateUsername);
router.post('/',controller.post);
router.put('/',controller.update);

export default router;