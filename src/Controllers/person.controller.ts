import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { Person, PersonModel } from "../Models/person.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Like } from "typeorm";

export class PersonController{

    async get(req:Request, res:Response):Promise<Response>{
        try {

            const relations = {
                student:true,
                professor:true,
                user:true,
            };
            const where = {
                id         : req.query?.id,
                cedule     : req.query?.cedule && Like(`%${Number(req.query?.cedule)}%`),
                name       : req.query?.name && Like(`%${req.query?.name}%`),
                lastName   : req.query?.lastName && Like(`%${req.query?.lastName}%`),
                phone      : req.query?.phone && Like(`%${req.query?.phone}%`),
                email      : req.query?.email && Like(`%${req.query?.email}%`),
                birthday   : req.query?.birthday,
                id_status  : req.query?.id_status
            };

            const findData = {where:removeFalsyFromObject(where), relations:relations};
            const personModel = new PersonModel();
            const persons = await personModel.get(Person, findData);

            if(persons.length == 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No person found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(persons);
            
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request,res:Response):Promise<any>{
        try {
            const { name, lastname } = req.body;

            if(!name && !lastname){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message:"Name or Lastname is required", status:HTTP_STATUS.BAD_REQUEST})
            }

            const newPerson = new Person(req.body);
            const errors = await validation(newPerson);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: errors, "status": HTTP_STATUS.BAD_REQUEST});
            }

            const personModel = new PersonModel();
            const person = await personModel.create(Person,newPerson);
            return res.status(HTTP_STATUS.CREATED).json(person);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response):Promise<Response>{
        try {

            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "id is required", status: HTTP_STATUS.BAD_REQUEST});
            }
            
            const personModel = new PersonModel();
            let personToUpdate = await personModel.getById(Person, req.body.id);

            if(!personToUpdate){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Person not found", status:HTTP_STATUS.NOT_FOUND});
            }

            let newData:any = new Person(req.body);
            newData = Object.entries(newData).filter(value => value[1])
            personToUpdate = Object.assign(personToUpdate,newData);
            
            const person = await personModel.create(Person,personToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(person);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}