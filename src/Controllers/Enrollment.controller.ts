import { Enrollment, EnrollmentModel } from "../Models/Enrollment.model";
import { validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Classroom } from "../Models/classroom.model";
import { Student } from "../Models/student.model";
import { Model } from "../Base/model";
import { ObjectLiteral } from "typeorm";

export class EnrollmentController{

    async get(_req: Request, res:Response):Promise<Response>{
        try {
            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.get(Enrollment);

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

    async getById(req: Request, res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.getById(Enrollment, id);

            if(!enrollment){
                console.log("No gradeStudent found");
                res.status(HTTP_STATUS.NOT_FOUND).send({message:"No gradeStudent found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(enrollment);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request, res:Response):Promise<Response>{
        try {
            const {id_student, id_classroom} = req.body;
            const model = new Model();
            const student = model.getById(Student, id_student);
            const classroom = model.getById(Classroom, id_classroom);

            if(!student || !classroom) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const dataEnrollment = new Map<String, ObjectLiteral>([
                ["student", student],
                ["classroom", classroom]
            ]);

            const newEnrollment = new Enrollment(dataEnrollment);
            const errors = await validation(newEnrollment);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const enrollment = await model.create(Enrollment,newEnrollment);
            return res.status(enrollment.status).json(enrollment);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}