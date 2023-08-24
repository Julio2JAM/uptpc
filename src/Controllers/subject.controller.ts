import { Subject, SubjectModel } from "../Models/subject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export class SubjectController{
    
    /**
     * Function to retrieve all records from the database.
     * @param {Request} _req request object
     * @param {Response} res res object
     * @returns {Promise<Response>}
     */
    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject);

            if(subject.length == 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not subject found',"status":HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(subject);
        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:'Something was wrong',status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    /**
     * Function to retrieve a specific record from the database.
     * @param req request object
     * @param res res object to send
     * @returns res object sent
     */
    async getById(req:Request, res:Response):Promise<Response>{
        try{
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
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

    async getByParams(req:Request, res:Response):Promise<Response>{
        try{
            
            const validateData = Array.from(Object.entries(req.params)).every(value => !value);
            if(validateData){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"No data send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.getByParams(req.params);

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

            const newSubject = new Subject(req.body);
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
            const {id} = req.body

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Id is requered","status":HTTP_STATUS.BAD_RESQUEST});
            }
            
            req.body.id = Number(id);
            const subjectModel = new SubjectModel();
            const subjectToUpdate = await subjectModel.getById(Subject,Number(id));
            
            if(!subjectToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Subject not found", status:HTTP_STATUS.NOT_FOUND});
            }

            for (const key in subjectToUpdate) {
                subjectToUpdate[key] = req.body[key] ?? subjectToUpdate[key];
            }

            const subject = await subjectModel.create(Subject,subjectToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(subject);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
}
