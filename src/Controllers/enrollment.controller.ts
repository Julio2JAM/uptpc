import { Enrollment, EnrollmentModel } from "../Models/enrollment.model";
import { validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Classroom } from "../Models/classroom.model";
import { Student } from "../Models/student.model";
import { Model } from "../Base/model";

export class EnrollmentController{

    async get(req: Request, res:Response):Promise<Response>{
        try {
            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.getByParams(req.query);

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

    async getStudent(req: Request, res: Response): Promise<Response>{
        try {
            const id_classroom = Number(req.params.id_classroom);

            if(!id_classroom){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: 'Invalid id_classroom', status: HTTP_STATUS.BAD_RESQUEST});
            }
            
            const enrollmentModel = new EnrollmentModel();
            const enrollment = await enrollmentModel.getStudent();

            if(!enrollment){
                return res.status(HTTP_STATUS.OK).send({message: 'Student not found', status:HTTP_STATUS.OK});
            }

            for (const key in enrollment) {
                console.log(enrollment[key]);
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

            if(!id_student && !id_classroom){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            const student = await model.getById(Student, id_student);
            const classroom = await model.getById(Classroom, id_classroom);

            if(!student || !classroom) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const data = {
                "student": student,
                "classroom": classroom
            };

            const newEnrollment = new Enrollment(data);
            const errors = await validation(newEnrollment);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const enrollment = await model.create(Enrollment,newEnrollment);
            return res.status(HTTP_STATUS.CREATED).json(enrollment);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong",status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}