import { ClassroomProfessor, ClassroomProfessorModel } from "../Models/classroomProfessor.mode";
import { Request, Response } from "express";
import { validate } from "class-validator";
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

    async getById(req: Request, res:Response){
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "The id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid id", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const classroomProfessorModel = new ClassroomProfessorModel();
            const classroomProfessor = await classroomProfessorModel.getById(ClassroomProfessor, id);

            if(!classroomProfessor){
                console.log("No classroomProfessor found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No classroomProfessor found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(classroomProfessor);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response){
        try {
            const dcp = new Map(Object.entries(req.body));
            const newCP = new ClassroomProfessor(dcp);

            const errors = await validate(newCP);
            if(errors.length > 0){
                console.log(errors);
                const keys = errors.map(err => err.property);
                const values = errors.map(({constraints}) => Object.values(constraints!));
                const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                console.log(message);
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message, "status": HTTP_STATUS.BAD_RESQUEST});
                //const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
            }

            const cpm = new ClassroomProfessorModel();
            const cp = await cpm.post_validation(newCP);
            //!NO TERMINADO
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
            return res.status(cp.status).json(cp);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}