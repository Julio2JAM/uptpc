import { ClassroomProfessor, ClassroomProfessorModel } from "../Models/classroomProfessor.mode";
import { Request, Response } from "express";
//import { validate } from "class-validator";
import { HTTP_STATUS } from "../Base/statusHttp";

export class ClassroomProfessorController{
    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const classroomProfessorModel = new ClassroomProfessorModel();
            const classroomProfessor = await classroomProfessorModel.get(ClassroomProfessor);

            if(classroomProfessor.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroomProfessor found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(classroomProfessor);
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}