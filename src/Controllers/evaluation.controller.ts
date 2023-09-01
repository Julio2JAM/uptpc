import { Evaluation, EvaluationModel } from "../Models/evaluation.model";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment } from "../Models/assignment.model";
import { Enrollment } from "../Models/enrollment.model";
import { Model } from "../Base/model";

export class AssignmentGradeController{

    async get(req: Request, res:Response):Promise<Response>{
        try {
            const relations = {
                assignment  : true,
                enrollment  : true,
            }
            const where = {
                id          : req.query?.id,
                grade       : req.query?.grade && Number(req.query?.grade),
                id_status   : req.query?.id_status && Number(req.query?.grade),
                assignment: {
                    id      : req.query?.idAssignment
                },
                enrollment: {
                    id      : req.query?.idEnrollment
                },
            }

            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.get(Evaluation, findData);

            if(evaluation.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No evaluation found."});
            }

            return res.status(HTTP_STATUS.OK).json(evaluation);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if (!req.body.assignment || !req.body?.enrollment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'Invalid data', status: HTTP_STATUS.BAD_RESQUEST});
            }
            
            const model = new Model();
            req.body.assignment = model.getById(Assignment, req.body.idAssignment);
            req.body.enrollment = model.getById(Enrollment, req.body.idEnrollment);

            const newEvaluation = new Evaluation(req.body);

            const error = validation(newEvaluation);
            if(!error){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({error: error, status: HTTP_STATUS.BAD_RESQUEST});
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