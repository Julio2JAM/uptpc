import { Request, Response } from "express";
import { UserModel } from "../Models/user.model";

export class UserController{

    async get(_req:Request, res:Response){
        try {
            const userModel = new UserModel();
            const user = await userModel.get();
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(404).send({"message":'not users found',"status":404});
        }
    }

    async getById(req: Request, res: Response){
        try {
            const userModel = new UserModel();
            const id = req.params.id;
            const user = await userModel.getById(Number(id));
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(404).send({"message":'not users found',"status":404});
        }
    }
    
}
