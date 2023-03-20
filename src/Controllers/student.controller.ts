import { validate } from "class-validator";
import { Request, Response } from "express";
import { Student, StudentModel } from "../Models/student.model";

export class StudentController{

    async get(_req:Request, res:Response){
        try {
            const studentModel = new StudentModel();
            const students = await studentModel.get(Student);
            console.log(students);

            if(students.length == 0){
                console.log("no data found");
                return res.status(404).send({"message":"No student found", "status":404});
            }
            return res.status(200).json(students);
        } catch (error) {
            return res.status(500).send({"message": "Something went wrong", "status":500});
        }
    }

    async getById(req:Request,res:Response){
        try {
            const { id } = req.params;

            if(!id){
                return res.status(400).json({"message": "Is is requiered", "status":400});
            }

            if(typeof id !== "number"){
                return res.status(400).send({ message:"The id is not a number"});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,id);

            if(!student){
                return res.status(404).json({"message": "No student found", "status":404});
            }

            return res.status(200).json(student);
        } catch (error) {
            return res.status(500).json({"message": "Something went wrong", "status":500});
        }
    }

    async post(req:Request,res:Response){
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
            return res.status(200).json(student)
        } catch (err) {
            console.log(err);
            return res.status(500).send({"error": "Something went wrong"});
        }
    }

    async update(req: Request, res: Response){
        try {
            const { id } = req.params;
            if(!id){
                return res.status(400).send({"error": "id is required", "status": "400"});
            }

            const studentModel = new StudentModel();
            const student = await studentModel.getById(Student,Number(id));

            if(!student){
                return res.status(404).send({"message": "Student not found", "status": "404"});
            }

            //no terminado
            return res.status(200).json(student);
        } catch (err) {
            return res.status(500).send({"message": "Something went wrong", "status": "500"});
        }
    }
}