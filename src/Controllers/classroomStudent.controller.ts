import { ClassroomStudent, ClassroomStudentModel } from "../Models/classroomStudent.model";
import { validation } from "../Base/helper";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export class ClassroomStudentController{

    async get(_req: Request, res:Response):Promise<Response>{
        try {
            const csm = new ClassroomStudentModel();
            const cs = await csm.get(ClassroomStudent);

            if(cs.length == 0){
                console.log("No classroomStudent found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroomStudent found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(cs);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const csm = new ClassroomStudentModel();
            const cs = await csm.getById(ClassroomStudent, id);

            if(!cs){
                console.log("No gradeStudent found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No gradeStudent found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(cs);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            const dcs = new Map(Object.entries(req.body));
            const newCS = new ClassroomStudent(dcs);

            const errors = await validation(newCS);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const csm = new ClassroomStudentModel();
            const cs = await csm.post_validation(newCS);
            return res.status(cs.status).json(cs);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}