import { Router } from "express";
import { ClassroomController } from "../Controllers/classroom.controller";

const router = Router();
const controller = new ClassroomController();

router.get("/",controller.get);
router.get("/:id",controller.getById);
router.post("/",controller.post);

export default router;