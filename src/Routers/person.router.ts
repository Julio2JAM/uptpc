import { PersonController } from "../Controllers/person.controller";
import { Router } from "express";
const router = Router();

const controller = new PersonController();

router.get('/',controller.get);
router.post('/',controller.post);

export default router;