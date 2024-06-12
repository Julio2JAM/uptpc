import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment_enrollment, Assignment_enrollmentModel } from "../Models/assignment_enrollment.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Assignment } from "../Models/assignment.model";
import { Classroom } from "../Models/classroom.model";
import Errors, { handleError } from "../Base/errors";

export class Assignment_enrollmentController{
    async get(req: Request, res: Response): Promise<Response>{
        try {
            
            const relations = {
                assignment: {
                    professor: {
                        person: true
                    }
                },
                classroom: true,
                subject: true,
            };

            const where = {
                assignment: {
                    id: req.query.idAssigment,
                    professor: {
                        id: req.query.idProfessorAssigment,
                        person: {
                            id: req.query.idPersonAssigment,
                        }
                    }
                },
                classroom: {
                    id: req.query.idClassroom,
                },
                subject: {
                    id: req.query.idSubject,
                },
            }

            const assignment_enrollmentModel = new Assignment_enrollmentModel();
            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const assignment_enrollment = await assignment_enrollmentModel.get(Assignment_enrollment, findData);

            if(assignment_enrollment.length == 0){
                throw new Errors.NotFound("No data found.");
            }

            return res.status(HTTP_STATUS.OK).json(assignment_enrollment);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body.idAssigment || !req.body.id_classroom){
                throw new Errors.BadRequest("Invalid data.");
            }

            const model = new Model();
            req.body.idAssigment = await model.getById(Assignment, req.body.idAssigment);
            req.body.idClassroom = await model.getById(Classroom, req.body.idClassroom);

            if(!req.body.idProfessor || !req.body.idAssigment || !req.body.idClassroom){
                throw new Errors.BadRequest("Invalid data.");
            }

            const assignment_enrollment = new Assignment_enrollment(req.body);
            const assignment_enrollmentNew = model.create(Assignment_enrollment, assignment_enrollment); 
            return res.status(HTTP_STATUS.CREATED).json(assignment_enrollmentNew);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const assignment_enrollmentModel = new Assignment_enrollmentModel();
            let assignment_enrollmentToUpdate = await assignment_enrollmentModel.getById(Assignment_enrollment, req.body.id);
            delete req.body.id;

            if(!assignment_enrollmentToUpdate){
                throw new Errors.BadRequest("No data found.");
            }

            assignment_enrollmentToUpdate = Object.assign(assignment_enrollmentToUpdate, req.body);
            const assignment_enrollment = await assignment_enrollmentModel.create(Assignment_enrollment, assignment_enrollmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(assignment_enrollment);

        } catch (error) {
            return handleError(error, res);
        }
    }
}