import express from "express";
import { UserController } from "../Controllers/user.controller";
const router = express.Router();

const controller = new UserController();

router.get('/user',controller.get);
router.get('/user/:id',controller.getById);

export default router;