import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
//import { validate } from "class-validator";

export class UserController{

    async get(_req:Request, res:Response){
        try {
            const userModel = new UserModel();
            const user = await userModel.get();
            
            if(user.length === 0){
                console.log("no data found");
                return res.status(404).send({"message":'not users found',"status":404});
            }
            
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }

    async getById(req: Request, res: Response){
        try {
            const userModel = new UserModel();
            const id = req.params.id;

            if(!id){
                return res.status(500).send({"message":'id is requered',"status":500});
            }

            const user = await userModel.getById(Number(id));

            if(!user){
                console.log("no data found");
                return res.status(404).send({"message":'not users found',"status":404});
            }

            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
    
    async create(req: Request, res: Response){
        try {
            const {username, password} = req.body
            const newUser = new User(username,password);
            const userModel = new UserModel();
            const user = await userModel.create(newUser);
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
/*
    async create(req: Request, res: Response){
        try {
            const {username, password} = req.body
            const newUser = new User(username,password);
            
            const errors = await validate(newUser);
            if(errors != undefined){
                //errors[0].constraints?.minLength;
                //const { constraints: { minlength } = {} } = errors[0];
                
            }
            return res.status(400).json({ message: `Error de validación: ${errors}` });
            //const userModel = new UserModel();
            //const user = await userModel.create(newUser);
            //return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
*/
    async update(req: Request, res: Response){
        try {
            const {id, username, password} = req.body

            if(!id){
                return res.status(500).send({"message":'id is requered',"status":500});
            }
            
            //const newUser = new User(username,password);
            const userModel = new UserModel();
            const userToUpdate = await userModel.getById(Number(id));
            
            if(!userToUpdate){
                return res.status(500).send({"message":'id is requered',"status":500});
            }

            if(username){
                userToUpdate.username = username;
            }
            if(password){
                userToUpdate.password = password;
            }

            const user = await userModel.create(userToUpdate);
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
    
}
