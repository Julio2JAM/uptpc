import { Classroom, ClassroomModel } from "../Models/classroom.model";
import { Request, Response } from "express";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Like } from "typeorm";
import Errors, { handleError, handleError2 } from "../Base/errors";
import { PDF } from "../libs/pdf";
import fs from 'fs';

interface response{
    response: any,
    status: number
};

export class ClassroomController{
    pdf = async (req: Request, res: Response) => {
        try {

            const where = {
                id              : req.query?.id,
                name            : req.query?.name && Like(`%${req.query?.name}%`),
                datetime_start  : req.query?.datetime_start,
                datetime_end    : req.query?.datetime_end,
                id_status       : req.query?.id_status,
            };
            const findData = {where: removeFalsyFromObject(where)}

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.get(Classroom, findData);
           
            const tableOptions = {
                title: 'Tabla de Docentes',
                subtitle:'Informacion de los Docentes',
                header: [
                    {label:'ID', width: 50},
                    {label:'Nombre', width: 128},
                    {label:'Fecha inicio', width: 120},
                    {label:'Fecha cierre', width: 120},
                    {label:'Estado', width: 50},
                ],
                rows: classroom,
                fields: ["id","name","datetime_start","datetime_end","id_status"]
            }

            const pdf = new PDF();
            const newPdf = await pdf.newPDF('secciones', tableOptions);

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

            const data = {
                id              : req.query?.id,
                name            : req.query?.name && Like(`%${req.query?.name}%`),
                datetime_start  : req.query?.datetime_start,
                datetime_end    : req.query?.datetime_end,
                id_status       : req.query?.id_status,
            }
            const whereOptions = Object.fromEntries(Object.entries(data).filter(value => value[1]));

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.get(Classroom, {where: whereOptions});

            if(classroom.length == 0){
                throw new Errors.NotFound(`Classroom not found`);
            }

            return {status: HTTP_STATUS.OK, response: classroom};

        } catch (error:any) {
            return handleError2(error);
        }
    }
    
    async post(req: Request, res: Response):Promise<Response>{
        try {
            
            const newClassroom = new Classroom(req.body);

            if( (req.body.datetime_start && req.body.datetime_end) && (new Date(req.body.datetime_start) > new Date(req.body.datetime_end)) ){
                throw new Errors.BadRequest(`Datetime start must be less than datetime end`);
            }

            const errors = await validation(newClassroom);
            if(errors) {
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const classroomModel = new ClassroomModel();
            const classroom = await classroomModel.create(Classroom, newClassroom);
            return res.status(HTTP_STATUS.CREATED).json(classroom);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response):Promise<Response>{
        try {
            
            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            if( (req.body.datetime_start && req.body.datetime_end) && (new Date(req.body.datetime_start) > new Date(req.body.datetime_end)) ){
                throw new Errors.BadRequest(`Datetime start must be less than datetime end`);
            }

            const classroomModel = new ClassroomModel();
            let classroomToUpdate = await classroomModel.getById(Classroom, req.body.id);
            delete req.body.id;

            if(!classroomToUpdate){
                throw new Errors.BadRequest(`Classroom not found`);
            }

            classroomToUpdate = Object.assign(classroomToUpdate, req.body);
            const classroom = await classroomModel.create(Classroom, classroomToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(classroom);
        } catch (error) {
            return handleError(error, res);
        }
    }
}