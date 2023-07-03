import { Program, ProgramModel } from "../Models/program.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/toolkit";
import { Model } from "../Base/model";
import { Classroom } from "../Models/classroom.model";
import { Subject } from "typeorm/persistence/Subject";
import { Employee } from "../Models/employee.model";
import { ObjectLiteral } from "typeorm";

export class ProgramController{
    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const programModel = new ProgramModel();
            const program = await programModel.get(Program);

            if(program.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No program found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const programModel = new ProgramModel();
            const program = await programModel.getById(Program, id);

            if(!program){
                console.log("No program found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No program found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getByParams(req: Request, res: Response): Promise<Response> {
        try {

            const {idClassroom, idSubject, idProfessor} = req.params;

            if(!idClassroom && !idSubject && !idProfessor) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'No data send', status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();

            let classroom: ObjectLiteral | null = null;
            if(idClassroom){
                classroom = model.getById(Classroom, Number(idClassroom));
            }

            let subject: ObjectLiteral | null = null;
            if(idSubject){
                subject = model.getById(Subject, Number(idSubject));
            }

            let professor: ObjectLiteral | null = null;
            if(idProfessor){
                professor = model.getById(Employee, Number(idProfessor));
            }

            if(!classroom && !subject && !professor) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'No data found', status: HTTP_STATUS.BAD_RESQUEST});
            }

            const params = {
                classroom: classroom,
                subject: subject,
                professor: professor,
            }
            const programModel = new ProgramModel();
            const program = programModel.getByParams(params);

            if(!program){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No program found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            const dataProgram = new Map(Object.entries(req.body));
            const newProgram = new Program(dataProgram);

            const errors = await validation(newProgram);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const programModel = new ProgramModel();
            const program = await programModel.post_validation(newProgram);
            return res.status(program.status).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}