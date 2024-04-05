import { Enrollment, EnrollmentModel } from "../Models/enrollment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Classroom } from "../Models/classroom.model";
import { Student } from "../Models/student.model";
import { Model } from "../Base/model";
import { Like } from "typeorm";
import { Program } from "../Models/program.model";
import { getUserData, removeFalsyFromObject } from "../Base/toolkit";
import Errors, { handleError } from "../Base/errors";

export class EnrollmentController{

    async get(req: Request, res:Response):Promise<Response>{
        try {

            const user = await getUserData(req.user);
            if(!user || !user.role){
                throw new Errors.Unauthorized(`Permission failed`);
            }
            req.query.idPerson = Number(user.role) === 3 ? String(user?.person) : '';

            const relations = {
                classroom           : true,
                student: {
                    person          : true,
                    representative1 : true,
                    representative2 : true,
                },
            }
            const where = {
                id                  : req.query?.id,
                id_status           : req.query?.idStatus,
                student: {
                    id              : req.query?.idStudent,
                    person:{
                        id          : req.query?.idPerson && Number(req.query.idPerson),
                        name        : req.query?.personName && Like(`%${req.query?.personName}%`),
                        lastName    : req.query?.personLastName && Like(`%${req.query?.personLastName}%`),
                        cedule      : req.query?.personCedule && Like(`%${req.query?.personCedule}%`),
                        phone       : req.query?.personPhone && Like(`%${req.query?.personPhone}%`),
                    }
                },
                classroom: {
                    id              : req.query?.idClassroom,
                    name            : req.query?.name && Like(`%${req.query?.name}%`),
                    datetime_start  : req.query?.datetime_start,
                    datetime_end    : req.query?.datetime_end,
                },
            };
            
            const findData = {relations: relations, where: removeFalsyFromObject(where)}
            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.get(Enrollment, findData);

            if(enrollment.length == 0){
                throw new Errors.NotFound(`Enrollments not found`);
            }

            return res.status(HTTP_STATUS.OK).json(enrollment);
        } catch (error) {
            return handleError(error, res);
        }
    }

    async studentNoClassroom(_req: Request, res: Response): Promise<Response>{
        try {

            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.studentNoClassroom();
            return res.status(HTTP_STATUS.OK).json(enrollment);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async getProgram(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.query.enrollment){
                throw new Errors.BadRequest(`Enrollment is required`);
            }

            const model = new Model();
            const enrollment = await model.getById(Enrollment,Number(req.query.enrollment),{
                classroom:true,
                student:{
                    person          : true,
                    representative1 : true,
                    representative2 : true,
                }
            });

            if(!enrollment){
                throw new Errors.BadRequest(`Enrollment not found`);
            }
            
            const relations =  { 
                classroom: true, 
                subject: true, 
                professor: { 
                    person: true
                }
            }
            const where = { 
                classroom: { 
                    id: enrollment.classroom.id
                },
                subject: {
                    name: req.query.subjectName
                },
                professor: {
                    person: {
                        name:req.query.professorName
                    }
                }
            }

            const program = await model.get(Program, {
                relations: relations,
                where: removeFalsyFromObject(where)
            });
            return res.status(HTTP_STATUS.OK).json(program);
            
        } catch (error) {
            return handleError(error, res);
        }
    }
    
    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const model = new Model();
            var enrollmentToUpdate = await model.getById(Enrollment, req.body.id, ["student", "classroom"])

            if(!enrollmentToUpdate){
                throw new Errors.BadRequest(`Enrollment no found`);
            }
            delete req.body.id;

            enrollmentToUpdate = Object.assign(enrollmentToUpdate, req.body);
            const enrollment = model.create(Enrollment, enrollmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(enrollment);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {

            const data = {
                student: req.body?.student,
                classroom: req.body?.classroom,
            }

            if(!data.classroom || !data.student){
                throw new Errors.BadRequest(`Invalid data`);
            }

            const model = new Model();
            data.student = await model.getById(Student, data.student);
            data.classroom = await model.getById(Classroom, data.classroom);

            if(!data.student || !data.classroom) {
                throw new Errors.BadRequest(`Invalid data`);
            }

            const newEnrollment = new Enrollment(data);
            const enrollment = await model.create(Enrollment, newEnrollment);
            return res.status(HTTP_STATUS.CREATED).json(enrollment);

        } catch (error) {
            return handleError(error, res);
        }
    }
}