import { Classroom, ClassroomModel } from "../Models/classroom.model";
import { Request, Response } from "express";
import { validation } from "../Base/helper";
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

    async post(req: Request, res: Response):Promise<Response>{
        try {
            const dataClassroom = new Map(Object.entries(req.body));
            const newClassroom = new Classroom(dataClassroom);

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
}