import { Assignment, AssignmentModel } from "../Models/assignment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { getUserData, removeFalsyFromObject, validation } from "../Base/toolkit";
import { Professor, ProfessorModel } from "../Models/professor.model";
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
                        id: req.query?.idPerson
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
            
            const user = await getUserData(req.user);
            if(!user || !user.role || Number(user.role) === 3){
                return res.status(HTTP_STATUS.UNAUTHORIZED).send({message:"Permission failed", status:HTTP_STATUS.UNAUTHORIZED});
            }

            // Inicializar el objeto professorData
            const professorData:any = {};

            // Verificar si el rol del usuario es 1 (admin)
            if (Number(user.role) === 1) {
                if (!req.body.professor) {
                    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Professor not found", status: HTTP_STATUS.BAD_REQUEST });
                }
                professorData.id = req.body.professor;
            } else {
                professorData.person = { id: user.person };
                professorData.relations = ["person"];
            }

            // Crear una nueva instancia de ProfessorModel
            const professorModel = new ProfessorModel();

            // Obtener el profesor utilizando professorData
            const professor = await professorModel.get(Professor, professorData);

            if(!professor){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message:"Professor not found", status:HTTP_STATUS.BAD_REQUEST});
            }

            const assignmentModel = new AssignmentModel();

            //! Esta funcion debe moverse al lugar donde se asigna la actividad
            /*
            if(req.body.porcentage){
                const porcentage = await assignmentModel.calculatePorcentage(req.body.program.id);

                if(porcentage && Number(req.body.porcentage) > porcentage.porcentage){
                   return res.status(HTTP_STATUS.BAD_REQUEST).send({message: `Porcenge valid: ${porcentage.porcentage}`, "status": HTTP_STATUS.BAD_REQUEST});
                }
            }
            */

            const newAssignment = new Assignment(req.body);
            const errors = await validation(newAssignment);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: errors, "status": HTTP_STATUS.BAD_REQUEST});
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
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "Invalid data", "status": HTTP_STATUS.BAD_REQUEST});
            }

            const assignmentModel = new AssignmentModel();
            let assignmentToUpdate = await assignmentModel.getById(Assignment, req.body.id, ["program"]);
            delete req.body.id;

            if(!assignmentToUpdate){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "No assignment fund", "status": HTTP_STATUS.BAD_REQUEST});
            }

            if(req.body.porcentage){
                const porcentage = await assignmentModel.calculatePorcentage(assignmentToUpdate.program.id);

                if(porcentage && Number(req.body.porcentage) > porcentage.porcentage && req.body.porcentage > assignmentToUpdate.porcentage){
                   return res.status(HTTP_STATUS.BAD_REQUEST).send({message: `Porcenge valid: ${porcentage.porcentage}`, "status": HTTP_STATUS.BAD_REQUEST});
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