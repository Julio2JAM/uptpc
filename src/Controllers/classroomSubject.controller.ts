import { ClassroomSubject, ClassroomSubjectModel } from "../Models/classroomSubject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/toolkit";

export class ClassroomSubjectController{
    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const classroomSubjectModel = new ClassroomSubjectModel();
            const classroomSubject = await classroomSubjectModel.get(ClassroomSubject);

            if(classroomSubject.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroomSubject found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(classroomSubject);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const classroomSubjectModel = new ClassroomSubjectModel();
            const classroomSubject = await classroomSubjectModel.getById(ClassroomSubject, id);

            if(!classroomSubject){
                console.log("No classroomSubject found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroomSubject found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(classroomSubject);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            const dcp = new Map(Object.entries(req.body));
            const newCP = new ClassroomSubject(dcp);

            const errors = await validation(newCP);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const cpm = new ClassroomSubjectModel();
            const cp = await cpm.post_validation(newCP);
            return res.status(cp.status).json(cp);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}