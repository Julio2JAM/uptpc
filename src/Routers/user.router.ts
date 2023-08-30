import { UserController } from "../Controllers/user.controller";
import { Router } from "express";
const router = Router();

const controller = new UserController();

router.get('/',controller.get);
router.get('/username/:username',controller.validateUsername);
router.post('/',controller.post);
router.post ('/register',controller.register);
router.put('/',controller.update);

export default router;