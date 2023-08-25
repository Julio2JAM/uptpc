import { Router } from "express";
import { StudentController } from "../Controllers/student.controller";
import { dataValidator } from "../middlewares/dataValidator";
import { Person } from "../Models/person.model";
import { Student } from "../Models/student.model";

const router = Router();
const controller = new StudentController();

router.get('/', (req, res, next) => dataValidator(Student, req, res, next), controller.get);
router.get('/:id', (req, res, next) => dataValidator(Person, req, res, next), controller.getById);
router.post('/', controller.post);
router.put('/', controller.put);

export default router;