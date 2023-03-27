import { AssignmentGrade, AssignmentGradeModel } from "../Models/assignmentGrade.model";
import { validation } from "../Base/helper";
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

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "The id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid id", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const assignmentGradeModel = new AssignmentGradeModel();
            const assignmentGrade = assignmentGradeModel.getById(AssignmentGrade, id);

            if(!assignmentGrade){
                console.log("No assignmentGrade found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No assignmentGrade found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(assignmentGrade);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const dataAssignmentGrade = new Map(Object.entries(req.body));
            const newAssignmentGrade = new AssignmentGrade(dataAssignmentGrade);

            const errors = await validation(newAssignmentGrade);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const assignmentGradeModel = new AssignmentGradeModel();
            const assignmentGrade = await assignmentGradeModel.post_validation(newAssignmentGrade);
            return res.status(assignmentGrade.status).json(assignmentGrade);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}