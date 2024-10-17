import { Subject, SubjectModel } from "../Models/subject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Like } from "typeorm";
import Errors, { handleError, handleError2 } from "../Base/errors";
import fs from 'fs';
import { removeFalsyFromObject } from "../Base/toolkit";
import { PDF } from "../libs/pdf"

interface response{
    response: any,
    status: number
};

export class SubjectController{
    
    pdf = async (req: Request, res: Response) => {
        try {

            const where = {
                id          : req.query?.id,
                name        : req.query?.name && Like(`%${req.query?.name}%`),
                description : req.query?.description && Like(`%${req.query?.description}%`),
                id_status   : req.query?.id_status,
            };
            const findData = {where: removeFalsyFromObject(where)};

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject, findData);
           
            const tableOptions = {
                title: 'Tabla de Materias',
                subtitle:'Informacion de las Materias',
                header: [
                    {label:'ID', width: 30},
                    {label:'Nombre', width: 184},
                    {label:'Descripcion', width: 184},
                    {label:'Estado', width: 70},
                ],
                rows: subject,
                fields: ["id","name","description","id_status"]
            }

            const pdf = new PDF();
            const newPdf = await pdf.newPDF('materias', tableOptions);

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

    /**
     * Function to retrieve records from the database.
     * @param {Request} req request object
     * @param {Response} res res object
     * @returns {Promise<Response>}
     */
    async get(req:Request):Promise<response>{
        try {

            const where = {
                id          : req.query?.id,
                name        : req.query?.name && Like(`%${req.query?.name}%`),
                description : req.query?.description && Like(`%${req.query?.description}%`),
                id_status   : req.query?.id_status,
            };
            const findData = {where: removeFalsyFromObject(where)};

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject, findData);

            if(subject.length == 0){
                throw new Errors.NotFound(`Subjects not found`);
            }
            
            return {status: HTTP_STATUS.OK, response: subject};

        } catch (error:any) {
            return handleError2(error);
        }
    }

    async post(req:Request):Promise<response>{
        try {

            const newSubject = new Subject(req.body);
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.create(Subject, newSubject);
            return {status: HTTP_STATUS.CREATED, response: subject};

        } catch (error:any) {
            return handleError2(error);
        }
    }

    async put(req: Request):Promise<response>{
        try {

            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }
            
            const subjectModel = new SubjectModel();
            let subjectToUpdate = await subjectModel.getById(Subject,req.body.id);
            delete req.body.id;
            
            if(!subjectToUpdate){
                throw new Errors.BadRequest(`Subject not found`);
            }

            subjectToUpdate = Object.assign(subjectToUpdate, req.body);
            const subject = await subjectModel.create(Subject,subjectToUpdate);
            return {status: HTTP_STATUS.CREATED, response: subject};

        } catch (error:any) {
            return handleError2(error);
        }
    }
    
}
