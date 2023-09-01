import { Calification, CalificationModel } from "../Models/calification.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Program } from "../Models/program.model";
import { Enrollment } from "../Models/enrollment.model";

export class SubjectGradeController{

    async get(req: Request, res: Response):Promise<Response>{
        try {
            const relations = {
                program     : true,
                enrollment  : true,
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

            if(!calification){
                console.log("Calification not found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No Calification founds", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(calification);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            
            const model = new Model();
            req.body.program = await model.getById(Program, Number(req.body.program));
            req.body.enrollment = await model.getById(Enrollment, Number(req.body.enrollment));

            if(!req.body.program && !req.body.enrollment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const calificationModel = new CalificationModel();
            const newSubjectGrade = new Calification(req.body);
            const errors = await validation(newSubjectGrade);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const calification = await calificationModel.create(Calification, newSubjectGrade);
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

            calificationToUpdate.grade = req.body.grade;
            calificationToUpdate.id_status = req.body.id_status;
            const calification = calificationModel.create(Calification, calificationToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(calification);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});    
        }
    }
}