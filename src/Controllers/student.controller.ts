import { Student, StudentModel } from "../Models/student.model";
import { Response, Request } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Person } from "../Models/person.model";
import { Like } from "typeorm";

export class StudentController{

    async get(req: Request, res: Response): Promise<Response>{
        try {

            const findData = {
                relations : {
                    person:true,
                    representative1:true,
                    representative2:true,
                },
                where:{
                    id : req.query?.id && Number(req.query.id),
                    person : {
                        id: req.query?.personId && Number(req.query.personId),
                        name : req.query?.personName && Like(`%${req.query?.personName}%`),
                        lastName : req.query?.personLastName && Like(`%${req.query?.personLastName}%`),
                        cedule : req.query?.personCedule && Like(`%${req.query?.personCedule}%`),
                        phone : req.query?.personPhone && Like(`%${req.query?.personPhone}%`),
                    },
                    representative1 : {
                        id: req.query?.representative1Id && Number(req.query.representative1Id),
                        name : req.query?.representative1Name && Like(`%${req.query?.representative1Name}%`),
                        lastName : req.query?.representative1LastName && Like(`%${req.query?.representative1LastName}%`),
                        cedule : req.query?.representative1Cedule && Like(`%${req.query?.representative1Cedule}%`),
                        phone : req.query?.representative1Phone && Like(`%${req.query?.representative1Phone}%`),
                    },
                    representative2 : {
                        id: req.query?.representative2Id && Number(req.query.representative2Id),
                        name : req.query?.representative2Name && Like(`%${req.query?.representative2Name}%`),
                        lastName : req.query?.representative2LastName && Like(`%${req.query?.representative2LastName}%`),
                        cedule : req.query?.representative2Cedule && Like(`%${req.query?.representative2Cedule}%`),
                        phone : req.query?.representative2Phone && Like(`%${req.query?.representative2Phone}%`),
                    },
                    id_status : req.query?.representative2Id_status && Like(`%${req.query?.representative2Id_status}%`)
                }
            }

            const studentModel = new StudentModel();
            const student = await studentModel.get(Student, findData);

            if(student.length == 0){
                console.log("No students found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No students found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(student);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(req.body.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No id send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new StudentModel();
            const studentToUpdate = await studentModel.getById(Student, req.body.id, ["person", "representative1", "representative2"]);

            if(!studentToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Student no fund", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const updatable = [
                "person",
                "representative1",
                "representative2",
            ];

            const model = new Model();
            for (const key in studentToUpdate) {

                if(!updatable.includes(key) || !req.body[key] && key == "person" || typeof req.body[key] !== "object") {
                    continue;
                }

                if(Object.entries(req.body[key]).length == 0 && req.body[key] !== undefined){
                    studentToUpdate[key] = null;
                }else if(!req.body[key].id && !studentToUpdate[key]){
                    const newPerson = new Person(req.body[key]);
                    studentToUpdate[key] = await model.create(Person,newPerson);
                }else if(req.body[key].id && !studentToUpdate[key]){
                    const newPerson = await model.getById(Person,req.body.id);
                    studentToUpdate[key] = newPerson;
                }else if(!req.body[key].id && Object.entries(studentToUpdate[key]).length > 0){
                    const newPerson = Object.assign(studentToUpdate[key], req.body[key]);
                    studentToUpdate[key] = await model.create(Person,newPerson);
                }

            }

            const student = await studentModel.create(Student, studentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(student);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body.person){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            for (const key in req.body) {

                if(Object.entries(req.body[key]).length == 0){
                    continue;
                }

                const newPerson = new Person(req.body[key]);
                req.body[key] = await model.create(Person,newPerson);

                if(!req.body[key]){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
                }

            }

            const studentModel = new StudentModel();
            const newStudent = new Student(req.body);
            const student = await studentModel.create(Student, newStudent);
            return res.status(HTTP_STATUS.CREATED).json(student);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

}