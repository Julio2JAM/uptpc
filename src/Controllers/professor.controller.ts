import { Request, Response } from "express";
import { Professor, ProfessorModel } from "../Models/professor.model";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Person, PersonModel } from "../Models/person.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { Like } from "typeorm";
import Errors, { handleError, handleError2 } from "../Base/errors";
import { PDF } from "../libs/pdf";
import fs from 'fs';

interface response{
    response: any,
    status: number
};

export class ProfessorController{

    pdf = async (req: Request, res: Response) => {
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
            const professor = await professorModel.get(Professor, findData);
           
            const tableOptions = {
                title: 'Tabla de Docentes',
                subtitle:'Informacion de los Docentes',
                header: [
                    {label:'ID', width: 40},
                    {label:'Nombre', width: 80},
                    {label:'Apellido', width: 80},
                    {label:'Cedula', width: 68},
                    {label:'Telefono', width: 80},
                    {label:'Email', width: 80},
                    {label:'Estado', width: 40},
                ],
                rows: professor,
                fields: ["id","person.name","person.lastName","person.cedule","person.phone","person.email","id_status"]
            }

            const pdf = new PDF();
            const newPdf = await pdf.newPDF('docentes', tableOptions);

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

    async get(req:Request):Promise<response>{
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
                throw new Errors.NotFound(`Subjects not found`);
            }

            return {status: HTTP_STATUS.OK, response: professor};

        } catch (error:any) {
            return handleError2(error);
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