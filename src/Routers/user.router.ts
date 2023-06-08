import { UserController } from "../Controllers/user.controller";
import { Router } from "express";
const router = Router();

const controller = new UserController();

router.get('/',controller.get);
router.get('/:id',controller.getById);
router.get('/username/:username',controller.validateUsername);
router.get('/username/:username?/level/:level?/status/:id_status?', controller.getByParams)
router.post('/',controller.post);
router.post ('/register',controller.register);
router.put('/',controller.update);

export default router;