import { Subject, SubjectModel } from "../Models/subject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Like } from "typeorm";

export class SubjectController{
    
    /**
     * Function to retrieve records from the database.
     * @param {Request} req request object
     * @param {Response} res res object
     * @returns {Promise<Response>}
     */
    async get(req:Request, res:Response):Promise<Response>{
        try {

            const data = {
                id          : req.query?.id,
                name        : req.query?.name && Like(`%${req.query?.name}%`),
                description : req.query?.description && Like(`%${req.query?.description}%`),
                id_status   : req.query?.id_status,
            };
            const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject, {where:whereOptions});

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

    async put(req: Request, res: Response):Promise<Response>{
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
