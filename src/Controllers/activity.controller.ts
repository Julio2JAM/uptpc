import { Activity, ActivityModel } from "../Models/activity.model";
import { Request, Response } from "express";
import { validate } from "class-validator";

export class ActivityController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const activityModel = new ActivityModel();
            const activity = await activityModel.get(Activity);

            if(activity.length == 0){
                console.log("No activity found");
                return res.status(404).send({"message": "No Activity found.", "status":404});
            }

            return res.status(200).json(activity);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":"Something went wrong", "status":500});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(400).send({ message:"Id is required" });
            }

            if(typeof id !== "number"){
                return res.status(400).send({ message:"The id is not a number"});
            }

            const activityModel = new ActivityModel();
            const activity = await activityModel.getById(Activity,id)
            return res.status(200).json(activity);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":"Something went wrong", "status":500});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            const dataActivity = new Map(Object.entries(req.body));
            const newActivity = new Activity(dataActivity);

            const errors = await validate(newActivity);
            if(errors.length > 0){
                console.log(errors);
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).send({"message": message, "status": 400});
            }

            const activityModel = new ActivityModel();
            const acitvity = await activityModel.create(Activity,newActivity);
            return res.status(200).json(acitvity)
        } catch (err) {
            console.log(err);
            return res.status(500).send({"message":"Something went wrong", "status":500})
        }
    }
}