import { Assignment, AssignmentModel } from "../Models/assignment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Program, ProgramModel } from "../Models/program.model";
import { Like } from "typeorm";

export class AssignmentController{

    async get(req:Request, res:Response):Promise<Response>{
        try {
            const relations = {
                program:{
                    classroom   : true,
                    professor   : true,
                    subject     : true,
                }
            }
            const where = {
                program: {
                    id          : req.query.idProgram,
                    classroom: {
                        id      : req.query.idClassroom
                    },
                    professor: {
                        id      : req.query.idProfessor
                    },
                    subject: {
                        id      : req.query.idSubject
                    },
                },
                name            : req.query?.name && Like(`%${req.query.name}%`),
                description     : req.query?.description && Like(`%${req.query.description}%`),
                porcentage      : req.query?.porcentage && Number(req.query.porcentage),
                quantity        : req.query?.quantity && Number(req.query.quantity),
                datetime_end    : req.query?.datetime_end,
                id_status       : req.query?.id_status,
            }

            const findData = {relations:relations, where: removeFalsyFromObject(where)}
            const assignmentModel = new AssignmentModel();
            const assignment = await assignmentModel.get(Assignment,findData);

            if(assignment.length == 0){
                console.log("No assignment found");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message: "No Assignment found.", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(assignment);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            
            if(!req.body?.program){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No program send", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const programModel = new ProgramModel();
            req.body.program = await programModel.getById(Program, req.body.program);

            if(!req.body.program){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid program", "status": HTTP_STATUS.BAD_RESQUEST});
            }
            
            const assignmentModel = new AssignmentModel();

            if(req.body.porcentage){
                const porcentage = assignmentModel.calculatePorcentage(1/*req.body.program.id*/);
                console.log(`Porcentage: ${porcentage}`);

                //if(Number(req.body.porcentage) < porcentage){
                //    return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid porcentage", "status": HTTP_STATUS.BAD_RESQUEST});
                //}
            }

            const newAssignment = new Assignment(req.body);
            const errors = await validation(newAssignment);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const acitvity = await assignmentModel.create(Assignment,newAssignment);
            return res.status(HTTP_STATUS.CREATED).json(acitvity)
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR})
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body?.id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const assignmentModel = new AssignmentModel();
            let assignmentToUpdate = await assignmentModel.getById(Assignment, req.body.id, ["program"]);

            if(!assignmentToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No assignment fund", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            assignmentToUpdate = Object.assign(assignmentToUpdate, req.body);
            const assignment = await assignmentModel.create(Assignment, assignmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(assignment);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({"message":"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR})
        }
    }
}