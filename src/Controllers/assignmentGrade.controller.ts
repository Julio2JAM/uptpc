import { AssignmentGrade, AssignmentGradeModel } from "../Models/assignmentGrade.model";
//import { validate } from "class-validator";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export class AssignmentGradeController{

    async get(_req: Request, res:Response):Promise<Response>{
        try {
            const assignmentGradeModel = new AssignmentGradeModel();
            const assignmentGrade = await assignmentGradeModel.get(AssignmentGrade);

            if(!assignmentGrade){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No AssignmentGrade found."});
            }

            return res.status(HTTP_STATUS.OK).json(assignmentGrade);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}