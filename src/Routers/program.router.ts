import { ProgramController } from "../Controllers/program.controller";
import { Router } from "express";

const router = Router();
const controller = new ProgramController();

router.get('/',controller.get)
router.get('/:id',controller.getById)
router.get('/idClassroom/:classroom?/idSubject/:subject?/idProfessor/:professor?',controller.getByParams)
router.post('/',controller.post)

export default router;