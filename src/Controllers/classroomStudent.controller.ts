import { ClassroomStudent, ClassroomStudentModel } from "../Models/classroomStudent.model";
import { validate } from "class-validator";
import { Request, Response } from "express";

export class ClassroomStudentController{

    async get(_req: Request, res:Response){
        try {
            const csm = new ClassroomStudentModel();
            const cs = await csm.get(ClassroomStudent);

            if(cs.length == 0){
                console.log("No classroomStudent found");
                return res.status(404).send({message:"No classroomStudent found",status:404});
            }

            return res.status(200).json(cs);
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

            const csm = new ClassroomStudentModel();
            const cs = await csm.getById(ClassroomStudent, id);

            if(!cs){
                console.log("No gradeStudent found");
                res.status(404).send({message:"No gradeStudent found",status:404});
            }
            return res.status(200).json(cs);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong",status:500});
        }
    }

    async post(req:Request, res:Response){
        try {
            const dcs = new Map(Object.entries(req.body));
            const newCS = new ClassroomStudent(dcs);

            const errors = await validate(newCS);
            if(errors.length > 0){
                console.log(errors);
                const keys = errors.map(err => err.property);
                const values = errors.map(({constraints}) => Object.values(constraints!));
                const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                console.log(message);
                return res.status(400).json({message, "status": "400"});
                //const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
            }

            const csm = new ClassroomStudentModel();
            const cs = await csm.post_validation(newCS);
            return res.status(cs.status).json(cs);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message:"Something went wrong",status:500});
        }
    }
}