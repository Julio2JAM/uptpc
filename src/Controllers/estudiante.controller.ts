import { Request, Response } from "express";
//import { EstudianteModel } from "../Models/estudiante.model";

export class EstudianteController{

    async handleRequest(_req: Request, res: Response){

        res.send("test");
        /*const estudianteModel = new EstudianteModel();
        try {
            const estudiantes = await estudianteModel.get();
            res.json(estudiantes);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error');
        }*/
    }
    
}