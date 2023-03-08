import { Request } from "express";
import { EstudianteModel } from "../Models/estudiante.model";

export class EstudianteController{

    async handleRequest(_req: Request){
        let estudianteModel = new EstudianteModel();
        try {
            const estudiantes = estudianteModel.get();
            return estudiantes;
        } catch (err) {
            console.error(err);
            //res.status(500).send('Error');
        }
    }
    
}