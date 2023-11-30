import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Assignment_enrollment, Assignment_enrollmentModel } from "../Models/assignment_enrollment.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { Professor } from "../Models/professor.model";
import { Model } from "../Base/model";
import { Assignment } from "../Models/assignment.model";

export class Assignment_enrollmentController{
    async get(req: Request, res: Response): Promise<Response>{
        try {
            
            const relations = {
                professor: {
                    person: true
                },
                Subject: true,
            };

            const where = {
                professor: {
                    id: req.query.idProfessor,
                    person:{
                        id: req.query.idPerson,
                    }
                },
                Subject: {
                    id: req.query.idSubject,
                },
            }

            const assignment_enrollmentModel = new Assignment_enrollmentModel();
            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const assignment_enrollment = await assignment_enrollmentModel.get(Assignment_enrollment, findData);

            if(assignment_enrollment.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).json({message: "No data found."});
            }

            return res.status(HTTP_STATUS.OK).json(assignment_enrollment);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body.idProfessor || !req.body.idAssigment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data.", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            req.body.idProfessor = await model.getById(Professor, req.body.idProfessor);
            req.body.idAssigment = await model.getById(Assignment, req.body.idAssigment);

            if(!req.body.idProfessor || !req.body.idAssigment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data.", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const assignment_enrollment = new Assignment_enrollment(req.body);
            const assignment_enrollmentNew = model.create(Assignment_enrollment, assignment_enrollment); 
            return res.status(HTTP_STATUS.CREATED).json(assignment_enrollmentNew);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No id send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const assignment_enrollmentModel = new Assignment_enrollmentModel();
            let assignment_enrollmentToUpdate = await assignment_enrollmentModel.getById(Assignment_enrollment, req.body.id);
            delete req.body.id;

            if(!assignment_enrollmentToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No data found.", status:HTTP_STATUS.BAD_RESQUEST});
            }

            assignment_enrollmentToUpdate = Object.assign(assignment_enrollmentToUpdate, req.body);
            const assignment_enrollment = await assignment_enrollmentModel.create(Assignment_enrollment, assignment_enrollmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(assignment_enrollment);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}