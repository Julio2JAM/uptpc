import { PersonController } from "../Controllers/person.controller";
import { Router } from "express";
const router = Router();

const controller = new PersonController();

router.get('/',controller.get);
router.post('/',controller.post);
router.put('/',controller.put);

export default router;