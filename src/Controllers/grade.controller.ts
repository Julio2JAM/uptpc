import { Grade, GradeModel } from "../Models/grade.model";
import { Request, Response } from "express";
import { validate } from "class-validator";

export class GradeController{
    async get(_req: Request, res: Response){
        try {
            const gradeModel = new GradeModel();
            const grade = await gradeModel.get(Grade);

            if(grade.length == 0){
                console.log("No grade found");
                return res.status(404).send({message: "No grade founds", status: 404});
            }

            return res.status(200).json(grade);   
        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Something went wrong", status: 500});
        }
    }

    async getById(req: Request, res: Response){
        try {
            const {id} = req.params;

            if(!id){
                return res.status(400).send({message: "The id is required", status: 400});
            }
            if(typeof id !== "number"){
                return res.status(400).send({message: "Invalid id for grade", status: 400});
            }

            const gradeModel = new GradeModel();
            const grade = await gradeModel.getById(Grade, id);

            if(!grade){
                console.log("No grade found");
                return res.status(404).send({message: "No grade founds", status: 404});
            }
            return res.status(200).json(grade);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Something went wrong", status: 500});
        }
    }

    async post(req: Request, res: Response){
        try {
            const dataGrade = new Map(Object.entries(req.body));
            const newGrade = new Grade(dataGrade);

            const errors = await validate(newGrade);
            if(errors.length > 0){
                console.log(errors);
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(404).send({message: message, status: 404});
            }

            const gradeModel = new GradeModel();
            const grade = await gradeModel.create(Grade, newGrade);
            return res.status(200).json(grade);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Something went wrong", status: 500});
        }
    }
}