import { Activity, ActivityModel } from "../Models/activity.model";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../Base/statusHttp";

export class ActivityController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const activityModel = new ActivityModel();
            const activity = await activityModel.get(Activity);

            if(activity.length == 0){
                console.log("No activity found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No Activity found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(activity);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;
            
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Id is required", status:HTTP_STATUS.BAD_RESQUEST});
            }

            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const activityModel = new ActivityModel();
            const activity = await activityModel.getById(Activity,id)
            return res.status(HTTP_STATUS.OK).json(activity);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
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
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({"message": message, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const activityModel = new ActivityModel();
            const acitvity = await activityModel.post_validation(newActivity);
            return res.status(HTTP_STATUS.CREATED).json(acitvity)
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR})
        }
    }
}