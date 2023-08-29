import { Router } from "express";
import { StudentController } from "../Controllers/student.controller";
import { dataValidator } from "../middlewares/dataValidator";
import { Person } from "../Models/person.model";

const router = Router();
const controller = new StudentController();

router.get('/', controller.get);
router.get('/:id', (req, res, next) => dataValidator(Person, req, res, next), controller.getById);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;