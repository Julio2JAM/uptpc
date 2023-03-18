import { UserController } from "../Controllers/user.controller";
import { Router } from "express";
const router = Router();

const controller = new UserController();

router.get('/',controller.get);
router.get('/:id',controller.getById);
router.post('/',controller.create);
router.put('/',controller.update);

export default router;