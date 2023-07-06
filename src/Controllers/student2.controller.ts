import { Student2, Student2Model } from "../Models/student2.model";
import { Response, Request } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { Model } from "../Base/model";
import { Student } from "../Models/student.model";
import { ObjectLiteral } from "typeorm";

export class Student2Controller{

    async get(_req: Request, res: Response): Promise<Response>{
        try {
            const studentModel = new Student2Model();
            const student = await studentModel.getRelations(Student2, ["student", "representative1", "representative2"]);

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

    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number(req.params.id);

            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No id send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const studentModel = new Student2Model();
            const student = await studentModel.getByIdRelations(Student2, id, ["student", "representative1", "representative2"]);

            if(!student){
                console.log("No students found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No students found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(student);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const { idStudent, idRepresentative1, idRepresentative2 } = req.body;
            const data:{[key: string]: number | string | ObjectLiteral | null} = {student:idStudent, representative1:idRepresentative1, representative2:idRepresentative2};

            const validateData = Object.values(data).every(value => !value);
            if(validateData){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const model = new Model();
            for (const key in data) {

                if(!data[key]){
                    continue;
                }

                data[key] = await model.getById(Student,Number(data[key]));

                if(!data[key]){
                    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Incorret data", status:HTTP_STATUS.BAD_RESQUEST});
                }

            }

            const student2Model = new Student2Model();
            const student2 = await student2Model.create(Student2, data);
            return res.status(HTTP_STATUS.CREATED).json(student2);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}