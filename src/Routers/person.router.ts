import { PersonController } from "../Controllers/person.controller";
import { Router } from "express";
const router = Router();

const controller = new PersonController();

router.get('/',controller.get);
//router.get('/cedule/:cedule/name/:name/',controller.get);
router.get('/:id',controller.getById);
router.get('/cedule/:cedule',controller.validateCedule);
router.post('/',controller.post);

export default router;