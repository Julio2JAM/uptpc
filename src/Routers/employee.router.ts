import { Router } from "express";
import { EmployeeController } from "../Controllers/employee.controller";

const router = Router();
const controller = new EmployeeController();

router.get('/', controller.get);
router.get('/:id', controller.getById);
router.post('/', controller.post);

export default router;