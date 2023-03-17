import { Request, Response } from "express";
import { Subject, SubjectModel } from "../Models/subject.model";

export class subjectController{
    
    async get(_req:Request, res:Response){
        try {
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject);

            if(subject.length == 0){
                console.log("no data found");
                return res.status(404).send({"message":'not users found',"status":404});
            }

            return res.status(200).json({subject});
        }catch(err){
            console.log(err);
            return res.status(500).send({err});
        }
    }

    async getById(req:Request, res:Response){
        try{
            const { id } = req.params;
    
            if(!id){
                return res.status(500).send({"error": "Invalid id"});
            }
    
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.getById(Subject,Number(id));
    
            if(!subject){
                return res.status(404).send({"message": "Subject not found"});
            }
    
            return res.status(200).json(subject);

        }catch(err){
            console.log(err);
            return res.status(500).send({"message": "Something went wrong"});
        }
    }
}
