import { Request, Response } from "express";
import { UserModel } from "../Models/user.model";

export class UserController{

    userModel=new UserModel();

    async get(res: Response){
        try {
            const user = await this.userModel.get();
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(404).send({"message":'not users found',"status":404});
        }
    }

    async getById(req: Request, res: Response){
        try {
            const id = req.params.id;
            const user = await this.userModel.getById(Number(id));
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(404).send({"message":'not users found',"status":404});
        }
    }
    
}
