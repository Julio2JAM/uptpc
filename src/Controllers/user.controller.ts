import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation, hashPassword, removeFalsyFromObject } from "../Base/toolkit";
import { Role } from "../Models/role.model";
import { Model } from "../Base/model";
import { Like } from "typeorm";
import { Person } from "../Models/person.model";

export class UserController{

    async get(req:Request, res:Response):Promise<Response>{
        try {

            const relations = {
                role: true,
                person: true
            }
            const where = {
                id          : req.query?.id,
                username    : req.query?.username && Like(`%${req.query?.username}%`),
                id_status   : req.query?.id_status,
                role: {
                    id      : req.query?.idRole
                },
                person: {
                    id      : req.query?.person,
                }
            }

            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const userModel = new UserModel();
            const user = await userModel.get(User,findData);

            if(user.length === 0){
                console.log("no users found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not users found', status:HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(user);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async validateUsername(req: Request, res: Response):Promise<Response>{
        try {
        
            if(!req.query.username){
                console.log("No username send");
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"No username found", status:HTTP_STATUS.BAD_RESQUEST});    
            }
            
            const userModel = new UserModel();
            const user = await userModel.get(User, {where:{username: req.query.username}});
            
            return res.status(HTTP_STATUS.OK).send({message: user[0] ? true : false, status:HTTP_STATUS.OK});

        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
    async post(req: Request, res: Response):Promise<any>{
        try {
            //Se valida que se haya enviado una password para procedeser a hashearse
            if(!req.body.password || req.body.password.length < 8 || req.body.password.length > 16){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid password", "status": HTTP_STATUS.BAD_RESQUEST});
            }
            req.body.password = await hashPassword(req.body.password);
            
            const model = new Model();
            if(req.body.role){
                const role = model.getById(Role, req.body.role ?? req.body.idRole);
                if(!role){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid role id", "status": HTTP_STATUS.BAD_RESQUEST});
                }
                req.body.role = role;
            }

            if(req.body.idPerson){
                const person = model.getById(Person,req.body.role);
                if(!person){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid person id", "status": HTTP_STATUS.BAD_RESQUEST});
                }
                req.body.person = person;
                delete req.body.idPerson;
            }

            //Se obtienen los datos del req y se usa el constructor para asignarlos
            const newUser = new User(req.body);
            
            //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
            const errors = await validation(newUser);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const user = await userModel.create(User,newUser);
            return res.status(HTTP_STATUS.CREATED).json(user);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            
            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Id is requered", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            var userToUpdate = await model.getById(User,req.body.id,["role", "person"]);
            delete req.body.id;
            
            if(!userToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"User not found", status:HTTP_STATUS.NOT_FOUND});
            }

            if(req.body.idPerson){
                const person = await model.getById(Person, req.body.idPerson);
                if(!person){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Invalid data", status:HTTP_STATUS.BAD_RESQUEST});
                }
                userToUpdate.person = person;
                delete req.body.idPerson;
            }

            if(req.body.idRole){
                const role = await model.getById(Role,req.body.idRole);
                if(!role){
                    res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Role not found", status:HTTP_STATUS.BAD_RESQUEST});
                }
                userToUpdate.role = role;
                delete req.body.idRole;
            }
            
            if(req.body.password){
                userToUpdate.password = await hashPassword(req.body.password);
                delete req.body.password;
            }

            userToUpdate = Object.assign(userToUpdate, req.body);
            const user = await model.create(User,userToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(user);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}
