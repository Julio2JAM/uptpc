import { Assignment, AssignmentModel } from "../Models/assignment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { getUserData, removeFalsyFromObject, validation } from "../Base/toolkit";
import { Program, ProgramModel } from "../Models/program.model";
import { Like } from "typeorm";

export class AssignmentController{

    async get(req:Request, res:Response):Promise<Response>{
        try {

            const user = await getUserData(req.user);
            if(!user || !user.role){
                return res.status(HTTP_STATUS.UNAUTHORIZED).send({message:"Permission failed", status:HTTP_STATUS.UNAUTHORIZED});
            }
            req.query.idPerson = Number(user.role) !== 1 ? String(user?.person) : '';

            const relations = {
                professor   : {
                    person: true
                },
            }
            const where = {
                id              : req.query?.id,
                professor       : {
                    id: req.query?.idProfessor,
                    person: {
                        // id: req.query?.idPerson //! TEMPORALMENTE COMENTADO
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
            const programRelations = {
                professor:{
                    person  : true
                },
                classroom   : true,
                subject     : true
            }
            req.body.program = await programModel.getById(Program, req.body.program, programRelations);

            if(!req.body.program){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "Invalid program", "status": HTTP_STATUS.BAD_RESQUEST});
            }
            
            const assignmentModel = new AssignmentModel();

            if(req.body.porcentage){
                const porcentage = await assignmentModel.calculatePorcentage(req.body.program.id);

                if(porcentage && Number(req.body.porcentage) > porcentage.porcentage){
                   return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: `Porcenge valid: ${porcentage.porcentage}`, "status": HTTP_STATUS.BAD_RESQUEST});
                }
            }

            const newAssignment = new Assignment(req.body);
            const errors = await validation(newAssignment);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const assignment = await assignmentModel.create(Assignment,newAssignment);
            return res.status(HTTP_STATUS.CREATED).json(assignment)
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
            delete req.body.id;

            if(!assignmentToUpdate){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: "No assignment fund", "status": HTTP_STATUS.BAD_RESQUEST});
            }

            if(req.body.porcentage){
                const porcentage = await assignmentModel.calculatePorcentage(assignmentToUpdate.program.id);

                if(porcentage && Number(req.body.porcentage) > porcentage.porcentage && req.body.porcentage > assignmentToUpdate.porcentage){
                   return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: `Porcenge valid: ${porcentage.porcentage}`, "status": HTTP_STATUS.BAD_RESQUEST});
                }
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