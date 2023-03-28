import { Subject, SubjectModel } from "../Models/subject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/helper";

export class SubjectController{
    
    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject);

            if(subject.length == 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not users found',"status":HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(subject);
        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:'Something was wrong',status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req:Request, res:Response):Promise<Response>{
        try{
            const { id } = req.params;
    
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid id", status:HTTP_STATUS.BAD_RESQUEST});
            }
    
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.getById(Subject,id);
    
            if(!subject){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Subject not found", status:HTTP_STATUS.NOT_FOUND});
            }
    
            return res.status(HTTP_STATUS.OK).json(subject);

        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            const {name, description} = req.body;
            const newSubject = new Subject(name, description);

            const errors = await validation(newSubject);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.create(Subject, newSubject);
            return res.status(HTTP_STATUS.CREATED).json(subject);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const {id, name} = req.body

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Id is requered","status":HTTP_STATUS.BAD_RESQUEST});
            }
            
            const subjectModel = new SubjectModel();
            const subjectToUpdate = await subjectModel.getById(Subject,Number(id));
            
            if(!subjectToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Subject not found", status:HTTP_STATUS.NOT_FOUND});
            }

            if(name){
                subjectToUpdate.name = name;
            }

            const subject = await subjectModel.create(Subject,subjectToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(subject);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}
