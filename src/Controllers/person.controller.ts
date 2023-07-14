import { validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { Person, PersonModel } from "../Models/person.model";
import { HTTP_STATUS } from "../Base/statusHttp";

export class PersonController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const personModel = new PersonModel();
            const persons = await personModel.get(Person);

            if(persons.length == 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No person found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(persons);
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req:Request,res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new PersonModel();
            const person = await personModel.getById(Person,id);

            if(!person){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No person found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(person);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getByParams(req: Request, res: Response): Promise<Response>{
        try {
            const { cedule } = req.params;
            
            if(!cedule){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Invalid cedule", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new PersonModel();
            const person = await personModel.getByCedule(Number(cedule));

            if(!person){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Person not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(person);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async validateCedule(req: Request, res: Response): Promise<Response>{
        try {
        
            const { cedule } = req.params;
            if(!cedule){
                console.log("No cedule send");
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"No cedule send.", status:HTTP_STATUS.BAD_RESQUEST});
            }
            
            const personModel = new PersonModel();
            const person = await personModel.getByCedule(Number(cedule));
            
            return res.status(HTTP_STATUS.OK).send({message: person ? true : false, status:HTTP_STATUS.OK});

        }catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }


    async post(req:Request,res:Response, child?:Record<string, any>):Promise<any>{
        try {
            const { name, lastname } = req.body;

            if(!name && !lastname){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Name or Lastname is required", status:HTTP_STATUS.BAD_RESQUEST})
            }

            const dataPerson = new Map(Object.entries(req.body));
            const newPerson = new Person(dataPerson);
            
            const errors = await validation(newPerson);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new PersonModel();
            const person = await personModel.create(Person,newPerson);
            return (!child) ? res.status(HTTP_STATUS.CREATED).json(person) : undefined;
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new PersonModel();
            const person = await personModel.getById(Person,id);

            if(!person){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Person not found", status:HTTP_STATUS.NOT_FOUND});
            }

            //no terminado
            return res.status(HTTP_STATUS.CREATED).json(person);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}