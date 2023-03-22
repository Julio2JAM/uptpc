import { validate } from "class-validator";
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
            const { id } = req.params;

            if(!id){
                return res.status(400).json({message: "Is is requiered", status:400});
            }

            if(typeof id !== "number"){
                return res.status(400).send({message:"The id is not a number", status:400});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,id);

            if(!student){
                return res.status(HTTP_STATUS.NOT_FOUND).json({message:"No student found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(student);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req:Request,res:Response):Promise<Response>{
        try {
            const dataStudent = new Map(Object.entries(req.body));
            const newStudent = new Student(dataStudent);
            
            const errors = await validate(newStudent);
            if(errors.length > 0){
                const message = errors.map(({constraints}) => Object.values(constraints!)).flat();
                return res.status(400).json({message, "status": "400"});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.create(Student,newStudent);
            return res.status(HTTP_STATUS.CREATED).json(student)
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async update(req: Request, res: Response):Promise<Response>{
        try {
            const { id } = req.params;
            if(!id){
                return res.status(400).send({"error": "id is required", "status": "400"});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,Number(id));

            if(!student){
                return res.status(HTTP_STATUS.NOT_FOUND).send({"message": "Student not found", "status": "HTTP_STATUS.NOT_FOUND"});
            }

            //no terminado
            return res.status(HTTP_STATUS.CREATED).json(student);
        } catch (err) {
            console.log(err);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}