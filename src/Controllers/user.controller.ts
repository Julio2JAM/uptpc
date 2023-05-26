import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation, hashPassword } from "../Base/toolkit";
import { StudentController } from "./student.controller";
import { Level, LevelModel } from "../Models/level.model";

export class UserController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const userModel = new UserModel();
            const user = await userModel.getRelations(User,["level"]);

            if(user.length === 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not users found', status:HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(user);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const user = await userModel.getById(User,id);

            if(!user){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Users not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(user);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async validateUsername(req: Request, res: Response):Promise<Response>{
        try {
        
            const { username } = req.params;
            if(!username){
                console.log("No username send");
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"No username found", status:HTTP_STATUS.BAD_RESQUEST});    
            }
            
            const userModel = new UserModel();
            const user = await userModel.getByUsername(username);
            
            return res.status(HTTP_STATUS.OK).send({message: user ? true : false, status:HTTP_STATUS.OK});

        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getByUsername(req: Request, res: Response):Promise<Response>{
        try {
        
            const { username } = req.params;
            if(!username){
                console.log("No username send");
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"No username found", status:HTTP_STATUS.BAD_RESQUEST});    
            }
            
            const userModel = new UserModel();
            const user = await userModel.getByUsername(username);

            if(!user){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Users not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(user);

        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
    async post(req: Request, res: Response, child?:Record<string, any>):Promise<any>{
        try {
            //Se valida que se haya enviado una password para procedeser a hashearse
            if(!req.body.password || req.body.password.length < 8 || req.body.password.length > 16){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: " Invalid password", "status": HTTP_STATUS.BAD_RESQUEST});
            }
            req.body.password = await hashPassword(req.body.password);
            
            if(!req.body.level){
                const levelModel = new LevelModel();
                const idLevel = levelModel.getById(Level,req.body.level);

                if(!idLevel){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No level found for that level", "status": HTTP_STATUS.BAD_RESQUEST});
                }

                req.body.level = idLevel;
            }

            //Se obtienen los datos del req y se usa el constructor para asignarlos
            const dataUser = new Map(Object.entries(req.body));
            const newUser = new User(dataUser);
            
            //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
            const errors = await validation(newUser);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const user = await userModel.create(User,newUser);
            
            return child == undefined ? res.status(HTTP_STATUS.CREATED).json(user) : undefined;
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async register(req: Request, res: Response):Promise<Response | undefined>{
        try {
            
            if(!req.body.user){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Data for user not found", status: HTTP_STATUS.BAD_RESQUEST});
            }

            if(!req.body.person){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Data for person not found", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const child: Record<string, any> = {
                bool:true
            };
            const user = req.body.user;
            const person = req.body.person;

            const personController = new StudentController();//new PersonController();
            req.body = person;
            const newPerson = await personController.post(req, res, child);
            
            if(newPerson){
                return;
            }
            
            req.body = user;
            const userController = new UserController();
            const newUser = await userController.post(req, res, child);
              
            if(newUser){
                return;
            }
            
            return res.status(HTTP_STATUS.OK).send({person:newPerson, user:newUser});
        }catch(error){
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something was wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const {id, id_level, username, password} = req.body

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Id is requered", status:HTTP_STATUS.BAD_RESQUEST});
            }
            
            //const newUser = new User(username,password);
            const userModel = new UserModel();
            const userToUpdate = await userModel.getById(User,Number(id));
            
            if(!userToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"User not found", status:HTTP_STATUS.NOT_FOUND});
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
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}
