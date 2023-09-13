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
                assignment  : {
                    program:{
                        classroom   : true,
                        subject     : true,
                        professor   : {
                            person: true
                        },
                    }
                },
                enrollment  : {
                    classroom           : true,
                    student: {
                        person          : true,
                        representative1 : true,
                        representative2 : true,
                    },
                },
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
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message: 'Invalid data', status: HTTP_STATUS.BAD_RESQUEST});
            }
            
            const model = new Model();
            const assignmentRelations = {
                program:{
                    classroom   : true,
                    subject     : true,
                    professor   : {
                        person: true
                    },
                }
            }
            req.body.assignment = await model.getById(Assignment, req.body.assignment, assignmentRelations);
            
            const enrollmentRelations = {
                classroom           : true,
                student: {
                    person          : true,
                    representative1 : true,
                    representative2 : true,
                },
            }
            req.body.enrollment = await model.getById(Enrollment, req.body.enrollment, enrollmentRelations);

            const newEvaluation = new Evaluation(req.body);
            const error = await validation(newEvaluation);
            if(error){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({error: error, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const validateEvaluation = await model.get(Evaluation, {
                assignment: req.body.assignment,
                enrollment: req.body.enrollment,
            });

            if(validateEvaluation.length > 0){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({error: "Alrady exist", status: HTTP_STATUS.BAD_RESQUEST});
            }

            if(req.body.grade > req.body.assignment.base){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({
                    error: "Invalid grade", 
                    min_grade: req.body.assignment.base, 
                    status: HTTP_STATUS.BAD_RESQUEST
                });
            }

            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.create(Evaluation,newEvaluation);
            return res.status(HTTP_STATUS.CREATED).json(evaluation);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message: 'Invalid data', status: HTTP_STATUS.BAD_RESQUEST});
            }

            const evaluationModel = new EvaluationModel();
            let evaluationToUpdate = await evaluationModel.getById(Evaluation, req.body.id, ["enrollment", "assignment"]);
            delete req.body.id;

            if(!evaluationToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message: 'Invalid evaluation', status: HTTP_STATUS.BAD_RESQUEST});
            }

            evaluationToUpdate = Object.assign(evaluationToUpdate, req.body);
            const error = await validation(evaluationToUpdate);
            if(error){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({error: error, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const evaluation = await evaluationModel.create(Evaluation,evaluationToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(evaluation);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}