import express from "express";
import { UserController } from "../Controllers/user.controller";
const router = express.Router();

const controller = new UserController();

router.get('/',controller.get);
router.get('/:id',controller.getById);
router.post('/',controller.create);
router.put('/',controller.update);

export default router;