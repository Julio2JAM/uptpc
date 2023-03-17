import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
import { validate } from "class-validator";

export class UserController{

    async get(_req:Request, res:Response){
        try {
            const userModel = new UserModel();
            const user = await userModel.get(User);

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
            const { id } = req.params;

            if(!id){
                return res.status(500).send({"message":'id is requered',"status":500});
            }

            const userModel = new UserModel();
            const user = await userModel.getById(User,Number(id));

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
            //Se obtienen los datos del req y se usa el constructor para asignarlos
            const {username, password} = req.body
            const newUser = new User(username,password);
            
            //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
            const errors = await validate(newUser);
            if(errors.length > 0){
                const messages = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).json({messages, "status": "400"});
            }

            const userModel = new UserModel();
            const user = await userModel.create(User,newUser);
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }

    async update(req: Request, res: Response){
        try {
            const {id, username, password} = req.body

            if(!id){
                return res.status(500).send({"message":'id is requered',"status":500});
            }
            
            //const newUser = new User(username,password);
            const userModel = new UserModel();
            const userToUpdate = await userModel.getById(User,Number(id));
            
            if(!userToUpdate){
                return res.status(404).send({"message":'id is requered',"status":500});
            }

            if(username){
                userToUpdate.username = username;
            }
            if(password){
                userToUpdate.password = password;
            }

            const user = await userModel.create(User,userToUpdate);
            return res.status(200).json(user);
        } catch (err) {
            console.error(err);
            return res.status(500).send({"message":'something was wrong',"status":500});
        }
    }
    
}
