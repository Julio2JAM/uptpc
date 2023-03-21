import { GradeStudent, GradeStudentModel } from "../Models/gradeStudent.model";
import { validate } from "class-validator";
import { Request, Response } from "express";

export class GradeStudentController{

    async get(_req: Request, res:Response){
        try {
            const gsm = new GradeStudentModel();
            const gs = await gsm.get(GradeStudent);

            if(gs.length == 0){
                console.log("No gradeStudent found");
                return res.status(404).send({message:"No gradeStudent found",status:404});
            }

            return res.status(200).json(gs);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong",status:500});
        }
    }

    async getById(req: Request, res:Response){
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(400).send({message: "The id is required", status: 400});
            }
            if(typeof id !== "number"){
                return res.status(400).send({message: "Invalid id", status: 400});
            }

            const gsm = new GradeStudentModel();
            const gs = await gsm.getById(GradeStudent, id);

            if(!gs){
                console.log("No gradeStudent found");
                res.status(404).send({message:"No gradeStudent found",status:404});
            }
            return res.status(200).json(gs);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong",status:500});
        }
    }

    async post(req:Request, res:Response){
        try {
            const dgs = new Map(Object.entries(req.body));
            const newGS = new GradeStudent(dgs);

            const errors = await validate(newGS);
            if(errors.length > 0){
                console.log(errors);
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).json({message, "status": "400"});
            }

            const gsm = new GradeStudentModel();
            const gs = await gsm.create(GradeStudent, newGS);
            return res.status(200).json(gs);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong",status:500});
        }
    }
}