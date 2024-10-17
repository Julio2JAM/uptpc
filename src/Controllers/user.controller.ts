import { Request, Response } from "express";
import { UserModel, User } from "../Models/user.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation, hashPassword, removeFalsyFromObject } from "../Base/toolkit";
import { Role } from "../Models/role.model";
import { Model } from "../Base/model";
import { Like } from "typeorm";
import { Person } from "../Models/person.model";
import Errors, { handleError } from "../Base/errors";
import { PDF } from "../libs/pdf";
import fs from 'fs';

export class UserController{

    async pdf (req: Request, res: Response) {
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

            const tableOptions = {
                title: 'Tabla de Usuarios',
                subtitle:'Informacion de los Usuarios',
                header: [
                    {label:'ID', width: 20},
                    {label:'Usuario', width: 78},
                    {label:'Rol', width: 80},
                    {label:'Nombre', width: 80},
                    {label:'Apellido', width: 80},
                    {label:'Cedula', width: 70},
                    {label:'Estado', width: 60},
                ],
                rows: user,
                fields: ["id","username","role.name","person.name","person.lastName","person.cedule","id_status"]
            }

            const pdf = new PDF();
            const newPdf = await pdf.newPDF('usuarios', tableOptions);

            if (typeof newPdf != "string") {
                throw new Errors.InternalServerError("Ocurrio un error al generar el documento.");
            }

            const pdfBuffer = fs.readFileSync(newPdf);
            return res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=document.pdf",
            }).send(pdfBuffer);

        } catch (error) {
            console.log(error);
            return handleError(error, res);
        }
    }

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
                throw new Errors.NotFound(`Subjects not found`);
            }
            return res.status(HTTP_STATUS.OK).json(user);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async validateUsername(req: Request, res: Response):Promise<Response>{
        try {
        
            if(!req.query.username){
                throw new Errors.BadRequest(`Username is requered`);
            }
            
            const userModel = new UserModel();
            const user = await userModel.get(User, {where:{username: req.query.username}});            
            return res.status(HTTP_STATUS.OK).send({message: user[0] ? true : false, status:HTTP_STATUS.OK});

        }catch (error) {
            return handleError(error, res);
        }
    }
    
    async post(req: Request, res: Response):Promise<any>{
        try {
            //Se valida que se haya enviado una password para procedeser a hashearse
            if(!req.body.password || req.body.password.length < 8 || req.body.password.length > 16){
                throw new Errors.BadRequest("Invalid password");
            }
            req.body.password = await hashPassword(req.body.password);
            
            const model = new Model();
            if(req.body.role || req.body.idRole){
                const role = await model.getById(Role, req.body.role ?? req.body.idRole);
                if(!role){
                    throw new Errors.BadRequest("Invalid role id");
                }
                if(!req.body.idRole){delete req.body.idRole;}
                req.body.role = role;
            }

            if(req.body.idPerson){
                const person = await model.getById(Person,req.body.idPerson);
                if(!person){
                    throw new Errors.BadRequest("Invalid person id");
                }
                req.body.person = person;
                delete req.body.idPerson;
            }

            //Se obtienen los datos del req y se usa el constructor para asignarlos
            const newUser = new User(req.body);
            
            //Se utiliza la funcion 'validate' para asegurarnos que los campos se hayan mandado de manera correcta
            const errors = await validation(newUser);
            if(errors) {
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const userModel = new UserModel();
            const user = await userModel.create(User,newUser);
            return res.status(HTTP_STATUS.CREATED).json(user);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            
            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const model = new Model();
            var userToUpdate = await model.getById(User,req.body.id,["role", "person"]);
            delete req.body.id;
            
            if(!userToUpdate){
                throw new Errors.BadRequest(`User not found`);
            }

            if(req.body.idPerson){
                const person = await model.getById(Person, req.body.idPerson);
                if(!person){
                    throw new Errors.BadRequest(`Invalid person data`);
                }
                userToUpdate.person = person;
                delete req.body.idPerson;
            }

            if(req.body.idRole){
                const role = await model.getById(Role,req.body.idRole);
                if(!role){
                    throw new Errors.BadRequest(`Invalid role data`);
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
            return handleError(error, res);
        }
    }
}
