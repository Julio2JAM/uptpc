import { ClassroomStudent, ClassroomStudentModel } from "../Models/classroomStudent.model";
import { validate } from "class-validator";
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
            const { id } = req.params;
            
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "The id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid id", status: HTTP_STATUS.BAD_RESQUEST});
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

            const errors = await validate(newCS);
            if(errors.length > 0){
                console.log(errors);
                const keys = errors.map(error => error.property);
                const values = errors.map(({constraints}) => Object.values(constraints!));
                const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                console.log(message);
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message, "status": HTTP_STATUS.BAD_RESQUEST});
                //const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
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