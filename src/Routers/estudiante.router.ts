import express from "express";
import { EstudianteController } from "../Controllers/estudiante.controller";
const router = express.Router();

router.get('/:id/:name', async (req, res) => {
    console.log(req.params);
    const estudianteController = new EstudianteController();
    let response = await estudianteController.handleRequest(req);
    res.status(200).json(response);
});

export default router;