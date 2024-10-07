import { Calification, CalificationModel } from "../Models/calification.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Program } from "../Models/program.model";
import { Enrollment } from "../Models/enrollment.model";
import Errors, { handleError } from "../Base/errors";

export class CalificationController{

    async get(req: Request, res: Response):Promise<Response>{
        try {
            const relations = {
                program     : {
                    classroom: true, 
                    subject: true,
                    professor: {
                        person: true
                    },
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
                grade       : req.query?.grade,
                id_status   : req.query?.id_status,
                program: {
                    id      : req.query?.idProgram
                },
                enrollment: {
                    id      : req.query?.idEnrollment
                },
            }
            const findData = {relations: relations, where: removeFalsyFromObject(where)};
            const calificationModel = new CalificationModel();
            const calification = await calificationModel.get(Calification,findData);

            if(calification.length === 0){
                throw new Errors.NotFound(`Califications not found`);
            }

            return res.status(HTTP_STATUS.OK).json(calification);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            if(!req.body.program && !req.body.enrollment){
                throw new Errors.BadRequest(`Invalid data`);
            }

            const model = new Model();
            req.body.program = await model.getById(Program, Number(req.body.program));
            req.body.enrollment = await model.getById(Enrollment, Number(req.body.enrollment), ["student"]);
            
            if(!req.body.program && !req.body.enrollment){
                throw new Errors.BadRequest(`Invalid data`);
            }

            const calificationModel = new CalificationModel();
            const grade = await calificationModel.calculateGrade(req.body.program.id,req.body.enrollment.student.id);
            req.body.grade = Number(grade.grade).toFixed(2);

            const newCalification = new Calification(req.body);
            const errors = await validation(newCalification);
            if(errors) {
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const calification = await model.create(Calification, newCalification);
            return res.status(HTTP_STATUS.CREATED).json(calification);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body?.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const calificationModel = new CalificationModel();
            const calificationToUpdate = await calificationModel.getById(Calification, req.body.id, ["program", "enrollment"]);

            if(!calificationToUpdate){
                throw new Errors.BadRequest(`Calification not found`);
            }

            const grade = await calificationModel.calculateGrade(req.body.program.id,req.body.enrollment.student.id);
            calificationToUpdate.grade = Number(grade.grade).toFixed(2);
            calificationToUpdate.id_status = req.body.id_status ?? calificationToUpdate.id_status;

            const calification = calificationModel.create(Calification, calificationToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(calification);

        } catch (error) {
            return handleError(error, res);
        }
    }
}