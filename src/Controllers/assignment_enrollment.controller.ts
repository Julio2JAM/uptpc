import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment_enrollment, Assignment_enrollmentModel } from "../Models/assignment_enrollment.model";
import { getUserData, removeFalsyFromObject } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Assignment } from "../Models/assignment.model";
import { Classroom } from "../Models/classroom.model";
import Errors, { handleError } from "../Base/errors";
import { Professor } from "../Models/professor.model";

export class Assignment_enrollmentController{
    async get(req: Request, res: Response): Promise<Response>{
        try {
            
            const relations = {
                assignment: {
                    professor: {
                        person: true
                    },
                    subject: true
                },
                classroom: true,
            };

            const where = {
                assignment: {
                    id: req.query.idAssigment,
                    professor: {
                        id: req.query.idProfessorAssigment,
                        person: {
                            id: req.query.idPersonAssigment,
                        }
                    },
                    subject: {
                        id: req.query.idSubject,
                    }
                },
                classroom: {
                    id: req.query.idClassroom,
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

            const user = await getUserData(req.user);

            if(!user || !user.role){
                throw new Errors.Unauthorized(`Permission failed.`);
            }

            if(Number(user.role) == 3){
                throw new Errors.BadRequest("Permission failed.");
            }

            if(!req.body.idAssignment || !req.body.idClassroom){
                throw new Errors.BadRequest("Invalid data.");
            }

            const model = new Model();

            req.body.assignment = await model.getById(Assignment, req.body.idAssignment);
            if(!req.body.assignment){
                throw new Errors.BadRequest("Invalid assignment.");
            }
            delete req.body.idAssignment;

            if(Number(user.role) == 2){
                const professor = await model.get(Professor, { relations:["person"], where:{person:{id:user?.person}}});
                if(!professor || req.body.assignment.professor != professor[0].id){
                    throw new Errors.BadRequest("Only your activities.");
                }
            }

            req.body.classroom = await model.getById(Classroom, req.body.idClassroom);
            if(!req.body.classroom){
                throw new Errors.BadRequest("Invalid classroom.");
            }
            delete req.body.idClassroom;

            const assignment_enrollmentModel = new Assignment_enrollmentModel();
            const percentage = await assignment_enrollmentModel.calculatePercentage(req.body.classroom.id, req.body.assignment.subject);
            console.log(percentage);
            if(percentage && Number(req.body.percentage) > percentage.percentage){
               return res.status(HTTP_STATUS.BAD_REQUEST).send({message: `Porcenge valid: ${percentage.percentage}`, "status": HTTP_STATUS.BAD_REQUEST});
            }

            const assignment_enrollment = new Assignment_enrollment(req.body);
            const newAssignment_enrollment = model.create(Assignment_enrollment, assignment_enrollment); 
            return res.status(HTTP_STATUS.CREATED).json(newAssignment_enrollment);
            // return res.status(HTTP_STATUS.CREATED).json({});

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