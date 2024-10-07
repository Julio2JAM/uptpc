import { Request, Response } from "express";
import { Professor, ProfessorModel } from "../Models/professor.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Person, PersonModel } from "../Models/person.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { Like } from "typeorm";
import Errors, { handleError } from "../Base/errors";

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
                    id          : req.query?.idPerson,
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
                throw new Errors.NotFound(`Professors not found`);
            }
            return res.status(HTTP_STATUS.OK).json(professor);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "Invalid data"});
            }

            const professorModel = new ProfessorModel();
            var professorToUpdate = await professorModel.getById(Professor, req.body.id, ["person"], false);

            if(!professorToUpdate){
                throw new Errors.BadRequest(`Professor not found`);
            }
            delete req.body.id;

            const personModel = new PersonModel();

            if(req.body.idPerson){
                professorToUpdate.person = await personModel.getById(Person, req.body.idPerson);
            }else if(professorToUpdate.person?.id){
                professorToUpdate.person = Object.assign(professorToUpdate.person, req.body.person);
                delete req.body.person;
            }
        
            professorToUpdate = Object.assign(professorToUpdate, req.body);
            const professor = await professorModel.create(Professor, professorToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(professor);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.person && !req.body.idPerson){
                throw new Errors.BadRequest(`Person data is requered`);
            }

            const professorModel = new ProfessorModel();
            const newProfessor = new Professor(req.body);
            const professor = await professorModel.create(Professor, newProfessor);
            return res.status(HTTP_STATUS.CREATED).json(professor);

        } catch (error) {
            return handleError(error, res);
        }
    }
}