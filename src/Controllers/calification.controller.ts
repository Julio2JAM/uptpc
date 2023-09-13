import { Calification, CalificationModel } from "../Models/calification.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Program } from "../Models/program.model";
import { Enrollment } from "../Models/enrollment.model";

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
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Calification not founds", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(calification);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            if(!req.body.program && !req.body.enrollment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            req.body.program = await model.getById(Program, Number(req.body.program));
            req.body.enrollment = await model.getById(Enrollment, Number(req.body.enrollment), ["student"]);
            
            if(!req.body.program && !req.body.enrollment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const calificationModel = new CalificationModel();
            const grade = await calificationModel.calculateGrade(req.body.program.id,req.body.enrollment.student.id);
            req.body.grade = Number(grade.grade).toFixed(2);

            const newCalification = new Calification(req.body);
            const errors = await validation(newCalification);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const calification = await model.create(Calification, newCalification);
            return res.status(HTTP_STATUS.CREATED).json(calification);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});    
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {
            
            if(!req.body?.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const calificationModel = new CalificationModel();
            const calificationToUpdate = await calificationModel.getById(Calification, req.body.id, ["program", "enrollment"]);

            if(!calificationToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Calification no found", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const grade = await calificationModel.calculateGrade(req.body.program.id,req.body.enrollment.student.id);
            calificationToUpdate.grade = Number(grade.grade).toFixed(2);
            calificationToUpdate.id_status = req.body.id_status ?? calificationToUpdate.id_status;

            const calification = calificationModel.create(Calification, calificationToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(calification);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});    
        }
    }
}