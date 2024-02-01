import { Router } from "express";
import { RoleController } from "../Controllers/role.controller";

const router = Router();
const controller = new RoleController();

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;