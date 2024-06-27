import { Evaluation, EvaluationModel } from "../Models/evaluation.model";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment } from "../Models/assignment.model";
import { Enrollment } from "../Models/enrollment.model";
import { Model } from "../Base/model";
import Errors, { handleError } from "../Base/errors";

export class EvaluationController{

    async get(req: Request, res:Response):Promise<Response>{
        try {
            const relations = {
                assignment_entry: {
                    assignment  : true,
                    classroom   : true,
                },
                enrollment  : {
                    classroom           : true,
                    student: {
                        person          : true,
                    },
                },
            }
            const where = {
                id          : req.query?.id,
                grade       : req.query?.grade && Number(req.query?.grade),
                id_status   : req.query?.id_status && Number(req.query?.grade),
                assignment_entry: {
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
                throw new Errors.NotFound(`Evaluations not found`);
            }

            return res.status(HTTP_STATUS.OK).json(evaluation);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if (!req.body.assignment || !req.body?.enrollment){
                throw new Errors.BadRequest(`Invalid data`);
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
            const errors = await validation(newEvaluation);
            if(errors){
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const validateEvaluation = await model.get(Evaluation, {
                assignment: req.body.assignment,
                enrollment: req.body.enrollment,
            });

            if(validateEvaluation.length > 0){
                throw new Errors.BadRequest("Alrady exist");
            }

            if(req.body.grade > req.body.assignment.base){
                throw new Errors.BadRequest(JSON.stringify({
                    error: "Invalid grade", 
                    min_grade: req.body.assignment.base, 
                    status: HTTP_STATUS.BAD_REQUEST
                }));
            }

            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.create(Evaluation,newEvaluation);
            return res.status(HTTP_STATUS.CREATED).json(evaluation);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async postAll(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.data){
                throw new Errors.BadRequest(`Invalid data`);
            }

            /*
            if (!req.body.assignment || !req.body?.enrollment){
                throw new Errors.BadRequest(`Invalid data`);
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
            const errors = await validation(newEvaluation);
            if(errors){
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const validateEvaluation = await model.get(Evaluation, {
                assignment: req.body.assignment,
                enrollment: req.body.enrollment,
            });

            if(validateEvaluation.length > 0){
                throw new Errors.BadRequest("Alrady exist");
            }

            if(req.body.grade > req.body.assignment.base){
                throw new Errors.BadRequest(JSON.stringify({
                    error: "Invalid grade", 
                    min_grade: req.body.assignment.base, 
                    status: HTTP_STATUS.BAD_REQUEST
                }));
            }
            const evaluationModel = new EvaluationModel();
            const evaluation = await evaluationModel.create(Evaluation,newEvaluation);
            */
            return res.status(HTTP_STATUS.CREATED).json({});
        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body.id){
                throw new Errors.BadRequest(`Invalid data`);
            }

            const evaluationModel = new EvaluationModel();
            let evaluationToUpdate = await evaluationModel.getById(Evaluation, req.body.id, ["enrollment", "assignment"]);
            delete req.body.id;

            if(!evaluationToUpdate){
                throw new Errors.BadRequest(`Invalid not found`);
            }

            evaluationToUpdate = Object.assign(evaluationToUpdate, req.body);
            const errors = await validation(evaluationToUpdate);
            if(errors){
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const evaluation = await evaluationModel.create(Evaluation,evaluationToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(evaluation);

        } catch (error) {
            return handleError(error, res);
        }
    }
}