import { Classroom, ClassroomModel } from "../Models/classroom.model";
import { Request, Response } from "express";
import { validation } from "../Base/toolkit";
import { HTTP_STATUS } from "../Base/statusHttp";

export class ClassroomController{
    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.get(Classroom);

            if(classroom.length == 0){
                console.log("No classroom found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No classroom founds", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(classroom);   
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {

            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.getById(Classroom, id);

            if(!classroom){
                console.log("No classroom found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No classroom founds", status: HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(classroom);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getByName(req: Request, res: Response):Promise<Response>{
        try {
            const {name} = req.params;
            
            if(!name){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Invalid name", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.getByName(name);

            if(!classroom){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroom found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(classroom);
        } catch (error) {    
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});            
        }
    }
    async post(req: Request, res: Response):Promise<Response>{
        try {
            
            const newClassroom = new Classroom(req.body);

            if(new Date(req.body.datetime_start) > new Date(req.body.datetime_end)){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Datetime start must be less than datetime end", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const errors = await validation(newClassroom);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.create(Classroom, newClassroom);
            return res.status(HTTP_STATUS.CREATED).json(classroom);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response):Promise<Response>{
        try {
            const {id} = req.body;
            
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"ID is requiered", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            if(new Date(req.body.datetime_start) > new Date(req.body.datetime_end)){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Datetime start must be less than datetime end", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            req.body.id = Number(id);
            const classroomModel = new ClassroomModel();
            const classroomToUpdate = await classroomModel.getById(Classroom, Number(id));

            if(!classroomToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Classroom not found", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            for(const key in classroomToUpdate){
                classroomToUpdate[key] = req.body[key] ?? classroomToUpdate[key];

                if(classroomToUpdate[key] === ""){
                    classroomToUpdate[key] = null;
                }
            }

            const classroom = await classroomModel.create(Classroom, classroomToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(classroom);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}