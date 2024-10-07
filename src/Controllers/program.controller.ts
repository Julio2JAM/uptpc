import { Program, ProgramModel } from "../Models/program.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Classroom } from "../Models/classroom.model";
import { Subject } from "../Models/subject.model";
import { Professor } from "../Models/professor.model";
import { getUserData, removeFalsyFromObject } from "../Base/toolkit";
import { Like } from "typeorm";
import Errors, { handleError } from "../Base/errors";

export class ProgramController{
    async get(req: Request, res: Response):Promise<Response>{
        try {
            
            const user = await getUserData(req.user);
            if(!user || !user.role){
                throw new Errors.Unauthorized(`Permission failed`);
            }
            req.query.idPerson = Number(user.role) == 2 ? String(user?.person) : '';

            const relations = {
                classroom: true, 
                subject: true,
                professor: {
                    person: true
                }, 
            };
            const where = {
                id              : req.query?.id,
                classroom: {
                    id          : req.query?.idClassroom,
                    name        : req.query?.classroomName,
                },
                subject: {
                    id          : req.query?.idSubject,
                    name        : req.query?.subjectName && Like(`%${req.query?.subjectName}%`),
                },
                professor: {
                    id          : req.query?.idProfessor,
                    person: {
                        id      : req.query?.idPerson,
                        name    : req.query?.personName && Like(`%${req.query?.personName}%`),
                        lastName: req.query?.personLastName && Like(`%${req.query?.personLastName}%`),
                        cedule  : req.query?.personCedule && Like(`%${req.query?.personCedule}%`),
                    }
                },
                id_status       : req.query?.idStatus,
            }

            const findData = {relations:relations, where: removeFalsyFromObject(where)}
            const programModel = new ProgramModel();
            const program = await programModel.get(Program, findData);

            if(program.length == 0){
                throw new Errors.NotFound(`Program not found`);
            }
            return res.status(HTTP_STATUS.OK).json(program);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            if(!req.body.idClassroom && !req.body.idSubject && !req.body.idProfessor) {
                throw new Errors.BadRequest(`Must be send a classroom, a Subject and a Professor`);
            }

            const model = new Model();

            req.body.idClassroom = await model.getById(Classroom, Number(req.body.idClassroom));
            req.body.idSubject = await model.getById(Subject, Number(req.body.idSubject));
            req.body.idProfessor = await model.getById(Professor, Number(req.body.idProfessor));

            if(!req.body.idClassroom && !req.body.idSubject && !req.body.idProfessor) {
                throw new Errors.BadRequest(`Data not found`);
            }

            const newProgram = new Program(req.body);
            const programModel = new ProgramModel();
            const program = await programModel.create(Program, newProgram);
            return res.status(HTTP_STATUS.CREATED).json(program);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req:Request, res:Response): Promise<Response> {
        try {

            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const programModel = new ProgramModel();
            var programToUpdate = await programModel.getById(Program, req.body.id);
            delete req.body.id;

            if(!programToUpdate){
                throw new Errors.BadRequest(`Program not found`);
            }

            programToUpdate = Object.assign(programToUpdate, req.body);
            const program = await programModel.create(Program, programToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(program);
            
        } catch (error) {
            return handleError(error, res);
        }
    }
}