import { SubjectGrade, SubjectGradeModel } from "../Models/subjectGrade.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Program } from "../Models/program.model";
import { Enrollment } from "../Models/enrollment.model";

export class SubjectGradeController{

    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const subjectGradeModel = new SubjectGradeModel();
            const subjectGrade = await subjectGradeModel.get(SubjectGrade);

            if(!subjectGrade){
                console.log("SubjectGrade not found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No SubjectGrade founds", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(subjectGrade);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectGradeModel = new SubjectGradeModel();
            const subjectGrade = await subjectGradeModel.getById(SubjectGrade, id);

            if(!subjectGrade){
                console.log("SubjectGrade not foun");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No SubjectGrade founds", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(subjectGrade);
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

            const subjectGradeModel = new SubjectGradeModel();
            const newSubjectGrade = new SubjectGrade(req.body);
            const errors = await validation(newSubjectGrade);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectGrade = await subjectGradeModel.create(SubjectGrade, newSubjectGrade);
            return res.status(HTTP_STATUS.CREATED).json(subjectGrade);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});    
        }
    }
}