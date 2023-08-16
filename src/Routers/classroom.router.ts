import { Router } from "express";
import { ClassroomController } from "../Controllers/classroom.controller";

const router = Router();
const controller = new ClassroomController();

router.get("/",controller.get);
router.get("/:id",controller.getById);
router.get("/name/:name?/status/:status?",controller.getByParams);
router.post("/",controller.post);
router.put("/",controller.put);

export default router;