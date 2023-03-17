import { Router } from "express";
import { subjectController } from "../Controllers/subject.controller";

const router = Router();
const controller = new subjectController();

router.get('/', controller.get);

export default router;