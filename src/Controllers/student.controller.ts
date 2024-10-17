import { Student, StudentModel } from "../Models/student.model";
import { Response, Request } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
// import { Model } from "../Base/model";
// import { Person } from "../Models/person.model";
import { Like } from "typeorm";
import { removeFalsyFromObject } from "../Base/toolkit";
import Errors, { handleError, handleError2 } from "../Base/errors";
import { PDF } from "../libs/pdf";
import fs from 'fs';

interface response{
    response: any,
    status: number
};

export class StudentController{

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

            const studentModel = new StudentModel();
            const student = await studentModel.get(Student, findData);
           
            const tableOptions = {
                title: 'Tabla de Estudiantes',
                subtitle:'Informacion de los Estudiantes',
                header: [
                    {label:'ID', width: 20},
                    {label:'Nombre', width: 80},
                    {label:'Apellido', width: 80},
                    {label:'Cedula', width: 68},
                    {label:'Telefono', width: 80},
                    {label:'Email', width: 80},
                    {label:'Estado', width: 60},
                ],
                rows: student,
                fields: ["id","person.name","person.lastName","person.cedule","person.phone","person.email","id_status"]
            }

            const pdf = new PDF();
            const newPdf = await pdf.newPDF('estudiantes', tableOptions);

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
                representative1:true,
                representative2:true,
            }

            const where:any = {
                id                  : req.query?.id && Number(req.query.id),
                id_status           : req.query?.id_status && Number(req.query?.id_status),
                person : {
                    id              : req.query?.personId && Number(req.query.personId),
                    name            : req.query?.personName && Like(`%${req.query?.personName}%`),
                    lastName        : req.query?.personLastName && Like(`%${req.query?.personLastName}%`),
                    cedule          : req.query?.personCedule && Like(`%${req.query?.personCedule}%`),
                    phone           : req.query?.personPhone && Like(`%${req.query?.personPhone}%`),
                },
                representative1 : {
                    id              : req.query?.representative1Id && Number(req.query.representative1Id),
                    name            : req.query?.representative1Name && Like(`%${req.query?.representative1Name}%`),
                    lastName        : req.query?.representative1LastName && Like(`%${req.query?.representative1LastName}%`),
                    cedule          : req.query?.representative1Cedule && Like(`%${req.query?.representative1Cedule}%`),
                    phone           : req.query?.representative1Phone && Like(`%${req.query?.representative1Phone}%`),
                },
                representative2 : {
                    id              : req.query?.representative2Id && Number(req.query.representative2Id),
                    name            : req.query?.representative2Name && Like(`%${req.query?.representative2Name}%`),
                    lastName        : req.query?.representative2LastName && Like(`%${req.query?.representative2LastName}%`),
                    cedule          : req.query?.representative2Cedule && Like(`%${req.query?.representative2Cedule}%`),
                    phone           : req.query?.representative2Phone && Like(`%${req.query?.representative2Phone}%`),
                },
            }

            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const studentModel = new StudentModel();
            const student = await studentModel.get(Student, findData);

            if(student.length == 0){
                console.log("No students found");
                throw new Errors.NotFound(`Students not found`);
            }
            
            return {status: HTTP_STATUS.OK, response: student};

        } catch (error:any) {
            return handleError2(error);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const studentModel = new StudentModel();
            var studentToUpdate = await studentModel.getById(Student, req.body.id, ["person", "representative1", "representative2"], false);

            if(!studentToUpdate){
                throw new Errors.BadRequest(`Student not found`);
            }
            delete req.body.id;

            const updatable = [
                "person",
                "representative1",
                "representative2",
            ];

            for (const value of updatable) {

                if(Object.entries(req.body[value]).length == 0){
                    studentToUpdate[value] = null;
                    delete req.body[value];
                }else if(!req.body[value].id && Object.entries(studentToUpdate[value]).length > 0){
                    studentToUpdate[value] = Object.assign(studentToUpdate[value], req.body[value]);
                    delete req.body[value];
                }

            }

            studentToUpdate = Object.assign(studentToUpdate, req.body);
            const student = await studentModel.create(Student, studentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(student);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.person){
                throw new Errors.BadRequest(`Person data is required`);
            }

            for (const key in req.body) {
                if(Object.entries(req.body[key]).length == 0){
                    delete req.body[key];
                }
            }

            const studentModel = new StudentModel();
            const newStudent = new Student(req.body);
            const student = await studentModel.create(Student, newStudent);
            return res.status(HTTP_STATUS.CREATED).json(student);

        } catch (error) {
            return handleError(error, res);
        }
    }

}