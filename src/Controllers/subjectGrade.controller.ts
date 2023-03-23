import { SubjectGrade, SubjectGradeModel } from "../Models/subjectGrade.model";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../Base/statusHttp";

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
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "The id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid id for subjectGrade", status: HTTP_STATUS.BAD_RESQUEST});
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
            const dataSubjectGrade = new Map(Object.entries(req.body));
            const newSubjectGrade = new SubjectGrade(dataSubjectGrade);

            const errors = await validate(newSubjectGrade);
            if(errors.length > 0){
                console.log(errors);
                const keys = errors.map(error => error.property);
                const values = errors.map(({constraints}) => Object.values(constraints!));
                const message = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
                console.log(message);
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectGradeModel = new SubjectGradeModel();
            const subjectGrade = await subjectGradeModel.post_validation(newSubjectGrade);
            return res.status(subjectGrade.status).json(subjectGrade);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});    
        }
    }
}