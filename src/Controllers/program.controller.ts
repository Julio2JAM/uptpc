import { Program, ProgramModel } from "../Models/program.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Classroom } from "../Models/classroom.model";
import { Subject } from "typeorm/persistence/Subject";
import { Professor } from "../Models/professor.model";
import { validation } from "../Base/toolkit";

export class ProgramController{
    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const programModel = new ProgramModel();
            const program = await programModel.getRelations(Program, ["classroom", "professor", "subject"]);

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
            const program = await programModel.getByIdRelations(Program, id, ["classroom", "professor", "subject"]);

            if(!program){
                console.log("No program found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No program found", status:HTTP_STATUS.NOT_FOUND});
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

            const params = {
                classroom: idClassroom,
                subject: idSubject,
                professor: idProfessor,
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

            if(!req.params.classroom && !req.params.subject && !req.params.professor) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'No data send', status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();

            req.params.classroom = await model.getById(Classroom, Number(req.params.classroom));
            req.params.subject = await model.getById(Subject, Number(req.params.subject));
            req.params.professor = await model.getById(Professor, Number(req.params.professor));

            if(!req.params.classroom && !req.params.subject && !req.params.professor) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'No data send', status: HTTP_STATUS.BAD_RESQUEST});
            }

            const programModel = new ProgramModel();
            const newProgram = programModel.getById(Program, req.body);

            const errors = await validation(newProgram);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, status: HTTP_STATUS.BAD_RESQUEST});
            }

            const program = await programModel.create(Program,newProgram);
            return res.status(HTTP_STATUS.CREATED).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}