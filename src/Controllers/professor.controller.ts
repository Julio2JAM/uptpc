import { Request, Response } from "express";
import { Professor, ProfessorModel } from "../Models/professor.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Person, PersonModel } from "../Models/person.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { Like } from "typeorm";

export class ProfessorController{

    async get(req: Request, res: Response): Promise<Response>{
        try {

            const relations = {
                person:true,
            };
            const where = {
                id              : req.query.id,
                id_status       : req.query.id_status,
                person : {
                    cedule      : req.query?.cedule && Like(`%${Number(req.query?.cedule)}%`),
                    name        : req.query?.name && Like(`%${req.query?.name}%`),
                    lastName    : req.query?.lastName && Like(`%${req.query?.lastName}%`),
                    phone       : req.query?.phone && Like(`%${req.query?.phone}%`),
                    email       : req.query?.email && Like(`%${req.query?.email}%`),
                    birthday    : typeof req.query?.birthday === "string" ? new Date(req.query.birthday) : undefined,
                },
            };

            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const professorModel = new ProfessorModel();
            const professor = await professorModel.get(Professor,findData);

            if(professor.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Professors not found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(professor);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data"});
            }

            const professorModel = new ProfessorModel();
            const professorToUpdate = await professorModel.getById(Professor, req.body.id, ["person"]);

            if(!professorToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Professor not found", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new PersonModel();

            if(req.body.idPerson){
                professorToUpdate.person = await personModel.getById(Person, req.body.idPerson);
            }else if(professorToUpdate.person?.id){
                professorToUpdate.person = Object.assign(professorToUpdate.person, req.body.person);
            }else{
                professorToUpdate.person = new Person(req.body.person);
            }
        
            const professor = await professorModel.create(Professor, professorToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(professor);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.person && !req.body.idPerson){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data"});
            }

            const professorModel = new ProfessorModel();
            const newProfessor = new Professor(req.body);
            const professor = await professorModel.create(Professor, newProfessor);
            return res.status(HTTP_STATUS.CREATED).json(professor);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}