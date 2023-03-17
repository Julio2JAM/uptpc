import { Request, Response } from "express";
import { Subject } from "../Models/subject.model";
import { Model } from "../base/model";

export class subjectController{
    
    async get(_req:Request, res:Response){
        try {
            const model = new Model();
            const subject = await model.get(Subject);

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
}
