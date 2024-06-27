import { Subject, SubjectModel } from "../Models/subject.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Like } from "typeorm";
import Errors, { handleError } from "../Base/errors";
import { generatePDF } from "../libs/pdfCreator";
import fs from 'fs';
import { removeFalsyFromObject } from "../Base/toolkit";

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

            const headers = ['id', 'nombre', 'estado'];
            const title = 'Tabla de Materias';
            const subtitle = 'informacion de las Materias';
            const pdf = await generatePDF(headers, title, subtitle, subject);

            if (typeof pdf != "string") {
              throw new Error("");
            }

            const pdfBuffer = fs.readFileSync(pdf);
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
    async get(req:Request, res:Response):Promise<Response>{
        try {

            const data = {
                id          : req.query?.id,
                name        : req.query?.name && Like(`%${req.query?.name}%`),
                description : req.query?.description && Like(`%${req.query?.description}%`),
                id_status   : req.query?.id_status,
            };
            const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.get(Subject, {where:whereOptions});

            if(subject.length == 0){
                throw new Errors.NotFound(`Subjects not found`);
            }
            return res.status(HTTP_STATUS.OK).json(subject);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {

            const newSubject = new Subject(req.body);
            const subjectModel = new SubjectModel();
            const subject = await subjectModel.create(Subject, newSubject);
            return res.status(HTTP_STATUS.CREATED).json(subject);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response):Promise<Response>{
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
            return res.status(HTTP_STATUS.CREATED).json(subject);

        } catch (error) {
            return handleError(error, res);
        }
    }
    
}
