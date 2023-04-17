import { validation } from "../Base/toolkit";
import { Request, Response } from "express";
import { Student, StudentModel } from "../Models/student.model";
import { HTTP_STATUS } from "../Base/statusHttp";

export class StudentController{

    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const studentModel = new StudentModel();
            const students = await studentModel.get(Student);
            console.log(students);

            if(students.length == 0){
                console.log("no data found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No student found", status:HTTP_STATUS.NOT_FOUND});
            }
            return res.status(HTTP_STATUS.OK).json(students);
        } catch (error) {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message: "Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req:Request,res:Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,id);

            if(!student){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"No student found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(student);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getByCedule(req: Request, res: Response): Promise<Response>{
        try {
            const { cedule } = req.body;
            
            if(!cedule){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Invalid cedule", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getByCedule(Number(cedule));

            if(!student){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Student not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(student);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request,res:Response):Promise<Response>{
        try {
            const dataStudent = new Map(Object.entries(req.body));
            const newStudent = new Student(dataStudent);
            
            const errors = await validation(newStudent);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.create(Student,newStudent);
            return res.status(HTTP_STATUS.CREATED).json(student)
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "id is required", status: HTTP_STATUS.BAD_RESQUEST});
            }
            if(typeof id !== "number"){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"The id is not a number", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,id);

            if(!student){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "Student not found", status:HTTP_STATUS.NOT_FOUND});
            }

            //no terminado
            return res.status(HTTP_STATUS.CREATED).json(student);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}