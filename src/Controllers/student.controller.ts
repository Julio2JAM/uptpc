import { Student, StudentModel } from "../Models/student.model";
import { Response, Request } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Person } from "../Models/person.model";
import { ObjectLiteral } from "typeorm";

export class StudentController{

    async get(_req: Request, res: Response): Promise<Response>{
        try {
            const personModel = new StudentModel();
            const person = await personModel.getRelations(Student, ["person", "representative1", "representative2"]);

            if(person.length == 0){
                console.log("No persons found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No persons found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(person);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No id send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const personModel = new StudentModel();
            const person = await personModel.getByIdRelations(Student, id, ["person", "representative1", "representative2"]);

            if(!person){
                console.log("No persons found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No persons found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(person);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const { idPerson, idRepresentative1, idRepresentative2 } = req.body;
            const data:{[key: string]: number | string | ObjectLiteral | null} = {person:idPerson, representative1:idRepresentative1, representative2:idRepresentative2};

            const validateData = Object.values(data).every(value => !value);
            if(validateData){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            for (const key in data) {

                if(!data[key]){
                    continue;
                }

                data[key] = await model.getById(Person,Number(data[key]));

                if(!data[key]){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
                }

            }

            const studentModel = new StudentModel();
            const student = await studentModel.create(Student, data);
            return res.status(HTTP_STATUS.CREATED).json(student);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}