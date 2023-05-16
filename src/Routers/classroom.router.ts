import { Router } from "express";
import { ClassroomController } from "../Controllers/classroom.controller";

const router = Router();
const controller = new ClassroomController();

router.get("/",controller.get);
router.get("/:id",controller.getById);
router.get("/name/:name",controller.getByName);
router.post("/",controller.post);
router.post("/postOrUpdate",controller.postOrUpdate);

export default router;