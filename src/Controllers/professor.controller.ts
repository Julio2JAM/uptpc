import { Request, Response } from "express";
import { Professor, ProfessorModel } from "../Models/professor.model";
//import { validation } from "../Base/toolkit";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Person } from "../Models/person.model";
import { Profession } from "../Models/profession.model";
import { ObjectLiteral } from "typeorm";

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
            const { idPerson, idProfession } = req.body;
            const data:{[key: string]: number | string | ObjectLiteral | null} = {person:idPerson, profession:idProfession};

            const validateData = Object.values(data).every(data => !data);
            if(validateData){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: ""});
            }

            const model = new Model();
            data["idPerson"] = await model.getById(Person, Number(data["idPerson"]));

            if(data["idProfession"]){
                data["idProfession"] = await model.getById(Profession, Number(data["idProfession"]));
            }

            //const newProfessor = new Professor(data);
            const professorModel = new ProfessorModel();
            //const professor = await professorModel.create(Professor, newProfessor);
            const professor = await professorModel.create(Professor, data);
            return res.status(HTTP_STATUS.CREATED).json(professor);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Internal Server Error", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}