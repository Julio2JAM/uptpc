import { SubjectController } from "../Controllers/subject.controller";
import { Router } from "express";

const router = Router();
const controller = new SubjectController();

router.get('/', controller.get);

export default router;