import { Router } from "express";
import { GradeController } from "../Controllers/grade.controller";

const router = Router();
const controller = new GradeController();

router.get("/",controller.get);
router.get("/:id",controller.getById);
router.post("/",controller.post);

export default router;