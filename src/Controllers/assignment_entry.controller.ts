import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment_entry, Assignment_entryModel } from "../Models/assignment_entry.model";
import { getUserData, removeFalsyFromObject } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Assignment } from "../Models/assignment.model";
import { Classroom } from "../Models/classroom.model";
import Errors, { handleError } from "../Base/errors";
import { Professor } from "../Models/professor.model";

export class Assignment_entryController{
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
                id_status: req.query.idStatus,
            }

            const assignment_entryModel = new Assignment_entryModel();
            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const assignment_entry = await assignment_entryModel.get(Assignment_entry, findData);

            if(assignment_entry.length == 0){
                throw new Errors.NotFound("No data found.");
            }

            return res.status(HTTP_STATUS.OK).json(assignment_entry);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async assignment_students(_req: Request, res: Response): Promise<Response>{
        try {
            
            const assignment_entryModel = new Assignment_entryModel();
            const assignment_entry = await assignment_entryModel.assignment_students(1, [2]);
            return res.status(HTTP_STATUS.OK).json(assignment_entry);

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

            const assignment_entryModel = new Assignment_entryModel();
            const percentage = await assignment_entryModel.calculatePercentage(req.body.classroom.id, req.body.assignment.subject);
            console.log(percentage);
            if(percentage && Number(req.body.percentage) > percentage.percentage){
               return res.status(HTTP_STATUS.BAD_REQUEST).send({message: `Porcenge valid: ${percentage.percentage}`, "status": HTTP_STATUS.BAD_REQUEST});
            }

            const assignment_entry = new Assignment_entry(req.body);
            const newAssignment_entry = model.create(Assignment_entry, assignment_entry); 
            return res.status(HTTP_STATUS.CREATED).json(newAssignment_entry);
            // return res.status(HTTP_STATUS.CREATED).json({});

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const assignment_entryModel = new Assignment_entryModel();
            let assignment_entryToUpdate = await assignment_entryModel.getById(Assignment_entry, req.body.id);
            delete req.body.id;

            if(!assignment_entryToUpdate){
                throw new Errors.BadRequest("No data found.");
            }

            assignment_entryToUpdate = Object.assign(assignment_entryToUpdate, req.body);
            console.log("🚀 ~ Assignment_entryController ~ put ~ assignment_entryToUpdate:", assignment_entryToUpdate)
            const assignment_entry = await assignment_entryModel.create(Assignment_entry, assignment_entryToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(assignment_entry);

        } catch (error) {
            return handleError(error, res);
        }
    }
}