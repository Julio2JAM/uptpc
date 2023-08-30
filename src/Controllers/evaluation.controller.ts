import { Evaluation, EvaluationModel } from "../Models/evaluation.model";
import { validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export class AssignmentGradeController{

    async get(_req: Request, res:Response):Promise<Response>{
        try {
            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.get(Evaluation);

            if(!evaluation){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No evaluation found."});
            }

            return res.status(HTTP_STATUS.OK).json(evaluation);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {

            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const evaluationModel = new EvaluationModel();
            const evaluation = evaluationModel.getById(Evaluation, id);

            if(!evaluation){
                console.log("No evaluation found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No evaluation found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(evaluation);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            const newEvaluation = new Evaluation(req.body);
            const errors = await validation(newEvaluation);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }
 
            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.create(Evaluation,newEvaluation);
            return res.status(HTTP_STATUS.CREATED).json(evaluation);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}