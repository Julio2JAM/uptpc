import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
import { validate } from "class-validator";
import { HTTP_STATUS } from "../Base/statusHttp";

export class UserController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const userModel = new UserModel();
            const user = await userModel.get(User);

            if(user.length === 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not users found', status:HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(user);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:'Something was wrong', status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({"message":'id is requered', status:HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const user = await userModel.getById(User,id);

            if(!user){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({"message":'not users found', status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(user);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":'something was wrong', status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
    async post(req: Request, res: Response):Promise<Response>{
        try {
            //Se obtienen los datos del req y se usa el constructor para asignarlos
            const {id_level, username, password} = req.body
            const newUser = new User(id_level,username,password);
            
            //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
            const errors = await validate(newUser);
            if(errors.length > 0){
                const messages = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({messages, status:HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const user = await userModel.create(User,newUser);
            return res.status(HTTP_STATUS.CREATED).json(user);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:'something was wrong',status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const {id, id_level, username, password} = req.body

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({"message":'id is requered',"status":HTTP_STATUS.BAD_RESQUEST});
            }
            
            //const newUser = new User(username,password);
            const userModel = new UserModel();
            const userToUpdate = await userModel.getById(User,Number(id));
            
            if(!userToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({"message":'User not found',"status":HTTP_STATUS.NOT_FOUND});
            }

            if(id_level){
                userToUpdate.id_level = id_level;
            }
            if(username){
                userToUpdate.username = username;
            }
            if(password){
                userToUpdate.password = password;
            }

            const user = await userModel.create(User,userToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(user);
        } catch (err) {
            console.error(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:'something was wrong', status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
}
