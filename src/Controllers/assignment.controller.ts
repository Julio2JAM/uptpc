import { Assignment, AssignmentModel } from "../Models/assignment.model";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../Base/statusHttp";

export class AssignmentController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const assignmentModel = new AssignmentModel();
            const assignment = await assignmentModel.get(Assignment);

            if(assignment.length == 0){
                console.log("No assignment found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No Assignment found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(assignment);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Id is required", status:HTTP_STATUS.BAD_RESQUEST});
            }

            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const assignmentModel = new AssignmentModel();
            const assignment = await assignmentModel.getById(Assignment,id)
            return res.status(HTTP_STATUS.OK).json(assignment);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            const dataAssignment = new Map(Object.entries(req.body));
            const newAssignment = new Assignment(dataAssignment);

            const errors = await validate(newAssignment);
            if(errors.length > 0){
                console.log(errors);
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({"message": message, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const assignmentModel = new AssignmentModel();
            const acitvity = await assignmentModel.post_validation(newAssignment);
            return res.status(HTTP_STATUS.CREATED).json(acitvity)
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR})
        }
    }
}