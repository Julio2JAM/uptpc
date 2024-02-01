import { Enrollment, EnrollmentModel } from "../Models/enrollment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Classroom } from "../Models/classroom.model";
import { Student } from "../Models/student.model";
import { Model } from "../Base/model";
import { Like } from "typeorm";
import { Program } from "../Models/program.model";
import { removeFalsyFromObject } from "../Base/toolkit";
import { User, UserModel } from "../Models/user.model";

export class EnrollmentController{

    async get(req: Request, res:Response):Promise<Response>{
        try {

            const userModel = new UserModel();
            const user = await userModel.getById(User, Number(req.user));
            const query: any = {
                idPerson: null,
            };

            if(!user){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No Enrollment found", status:HTTP_STATUS.NOT_FOUND});
            }
            
            if(user.role !== 1){
                query.idPerson = user.person;
                req.query = query;
            }

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
                console.log("No Enrollment found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No Enrollment found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(enrollment);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async studentNoClassroom(_req: Request, res: Response): Promise<Response>{
        try {

            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.studentNoClassroom();
            return res.status(HTTP_STATUS.OK).json(enrollment);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getProgram(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.query.enrollment){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Enrollment is required", status: HTTP_STATUS.BAD_RESQUEST});
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
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid enrollment", status: HTTP_STATUS.BAD_RESQUEST});
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
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status: HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            var enrollmentToUpdate = await model.getById(Enrollment, req.body.id, ["student", "classroom"])

            if(!enrollmentToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Enrollment no found", status: HTTP_STATUS.BAD_RESQUEST});
            }
            delete req.body.id;

            enrollmentToUpdate = Object.assign(enrollmentToUpdate, req.body);
            const enrollment = model.create(Enrollment, enrollmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(enrollment);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {

            const data = {
                student: req.body?.student,
                classroom: req.body?.classroom,
            }

            if(!data.classroom || !data.student){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            data.student = await model.getById(Student, data.student);
            data.classroom = await model.getById(Classroom, data.classroom);

            if(!data.student || !data.classroom) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const newEnrollment = new Enrollment(data);
            const enrollment = await model.create(Enrollment, newEnrollment);
            return res.status(HTTP_STATUS.CREATED).json(enrollment);

        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}