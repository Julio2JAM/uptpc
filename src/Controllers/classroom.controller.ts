import { Classroom, ClassroomModel } from "../Models/classroom.model";
import { Request, Response } from "express";
import { validate } from "class-validator";

export class ClassroomController{
    async get(_req: Request, res: Response){
        try {
            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.get(Classroom);

            if(classroom.length == 0){
                console.log("No classroom found");
                return res.status(404).send({message: "No classroom founds", status: 404});
            }

            return res.status(200).json(classroom);   
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
                return res.status(400).send({message: "Invalid id for classroom", status: 400});
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.getById(Classroom, id);

            if(!classroom){
                console.log("No classroom found");
                return res.status(404).send({message: "No classroom founds", status: 404});
            }
            return res.status(200).json(classroom);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Something went wrong", status: 500});
        }
    }

    async post(req: Request, res: Response){
        try {
            const dataClassroom = new Map(Object.entries(req.body));
            const newClassroom = new Classroom(dataClassroom);

            const errors = await validate(newClassroom);
            if(errors.length > 0){
                console.log(errors);
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(404).send({message: message, status: 404});
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.create(Classroom, newClassroom);
            return res.status(200).json(classroom);
        } catch (err) {
            console.log(err);
            return res.status(500).send({message: "Something went wrong", status: 500});
        }
    }
}