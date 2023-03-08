import express from "express";
import { EstudianteController } from "../Controllers/estudiante.controller";
const router = express.Router();

router.get('/', async (req, res) => {
    const estudianteController = new EstudianteController();
    let response = await estudianteController.handleRequest(req, res);
    res.send(response);
});

export default router;