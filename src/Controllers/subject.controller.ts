import { validate } from "class-validator";
import { Request, Response } from "express";
import { Subject, SubjectModel } from "../Models/subject.model";

export class SubjectController{
    
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
                return res.status(400).send({"error": "Invalid id"});
            }
    
            if(typeof id !== "number"){
                return res.status(400).send({ message:"The id is not a number"});
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.getById(Subject,id);
    
            if(!subject){
                return res.status(404).send({"message": "Subject not found"});
            }
    
            return res.status(200).json(subject);

        }catch(err){
            console.log(err);
            return res.status(500).send({"message": "Something went wrong"});
        }
    }

    async post(req:Request, res:Response){
        try {
            const {name/*, code*/} = req.body;
            const newSubject = new Subject(name/*, code*/);

            const errors = await validate(newSubject);
            if(errors.length > 0){
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).json({message, "status": "400"});
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.create(Subject, newSubject);
            return res.status(201).json(subject);

        } catch (err) {
            console.log(err);
            return res.status(500).send({"error": "Something went wrong"});
        }
    }

    async update(req: Request, res: Response){
        try {
            const {id, name} = req.body

            if(!id){
                return res.status(400).send({"message":'id is requered',"status":500});
            }
            
            const subjectModel = new SubjectModel();
            const subjectToUpdate = await subjectModel.getById(Subject,Number(id));
            
            if(!subjectToUpdate){
                return res.status(404).send({"message":'id is requered',"status":500});
            }

            if(name){
                subjectToUpdate.name = name;
            }

            const subject = await subjectModel.create(Subject,subjectToUpdate);
            return res.status(200).json(subject);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
}
