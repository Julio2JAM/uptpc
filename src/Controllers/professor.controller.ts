import { Request, Response } from "express";
import { Professor, ProfessorModel } from "../Models/professor.model";
//import { validation } from "../Base/toolkit";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Person, PersonModel } from "../Models/person.model";
import { validation } from "../Base/toolkit";

export class ProfessorController{
    async get(_req: Request, res: Response): Promise<Response>{
        try {
            const professorModel = new ProfessorModel();
            const professor = await professorModel.getRelations(Professor, ["person", "profession"]);

            if(!professor){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Person not found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(professor);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Id is required", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const professorModel = new ProfessorModel();
            const professor = await professorModel.getById(Professor, id);

            if(!professor){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Professor not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(professor);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.idPerson){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data"});
            }

            const personModel = new PersonModel();
            req.body.idPerson = await personModel.getById(Person, Number(req.body.idPerson));

            const professorModel = new ProfessorModel();
            const newProfessor = new Professor(req.body.idPerson);

            const errors = await validation(newProfessor);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const professor = await professorModel.create(Professor, newProfessor);
            return res.status(HTTP_STATUS.CREATED).json(professor);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}