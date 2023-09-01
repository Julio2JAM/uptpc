import { Program, ProgramModel } from "../Models/program.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Classroom } from "../Models/classroom.model";
import { Subject } from "typeorm/persistence/Subject";
import { Professor } from "../Models/professor.model";
import { removeFalsyFromObject } from "../Base/toolkit";

export class ProgramController{
    async get(req: Request, res: Response):Promise<Response>{
        try {
            const relations = {
                classroom: true, 
                professor: {
                    person: true
                }, 
                subject: true
            };
            const where = {
                id              : req.query?.id,
                classroom: {
                    id          : req.query?.idClassroom,
                    name        : req.query?.classroomName,
                },
                subject: {
                    id          : req.query?.idSubject,
                    name        : req.query?.subjectName,
                },
                professor: {
                    id          : req.query?.idProfessor,
                    person: {
                        name    : req.query?.professorName,
                    }
                },
            }
            
            const findData = {relations:relations, where: removeFalsyFromObject(where)}
            const programModel = new ProgramModel();
            const program = await programModel.get(Program, findData);

            if(program.length == 0){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No program found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(program);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
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

            const newProgram = new Program(req.body);
            const programModel = new ProgramModel();
            const program = await programModel.create(Program,newProgram);
            return res.status(HTTP_STATUS.CREATED).json(program);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}