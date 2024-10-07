import { Assignment, AssignmentModel } from "../Models/assignment.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { getUserData, removeFalsyFromObject, validation } from "../Base/toolkit";
import { Professor, ProfessorModel } from "../Models/professor.model";
import { Like } from "typeorm";
import Errors, { handleError } from "../Base/errors";
import { Subject, SubjectModel } from "../Models/subject.model";

export class AssignmentController{

    async get(req:Request, res:Response):Promise<Response>{
        try {

            const user = await getUserData(req.user);
            if(!user || !user.role){
                throw new Errors.Unauthorized(`Permission failed`);
            }
            req.query.idPerson = Number(user.role) !== 1 ? String(user?.person) : '';

            const relations = {
                professor   : {
                    person: true
                },
                subject: true
            }
            const where = {
                id              : req.query?.id,
                professor       : {
                    id: req.query?.idProfessor,
                    person: {
                        id: req.query?.idPerson
                    },
                },
                subject       : {
                    id: req.query?.idSubject,
                },
                title           : req.query?.title && Like(`%${req.query.title}%`),
                description     : req.query?.description && Like(`%${req.query.description}%`),
                porcentage      : req.query?.porcentage && Number(req.query.porcentage),
                quantity        : req.query?.quantity && Number(req.query.quantity),
                datetime_end    : req.query?.datetime_end,
                datetime_start  : req.query?.datetime_start,
                id_status       : req.query?.id_status,
            }

            const findData = {relations:relations, where: removeFalsyFromObject(where)}
            const assignmentModel = new AssignmentModel();
            const assignment = await assignmentModel.get(Assignment,findData);

            if(assignment.length == 0){
                throw new Errors.NotFound(`Assignments not found`);
            }
            return res.status(HTTP_STATUS.OK).json(assignment);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {
            
            const user = await getUserData(req.user);
            if(!user || !user.role || Number(user.role) === 3){
                throw new Errors.Unauthorized(`Permission failed`);
            }

            // Inicializar el objeto professorData
            const professorData:any = {};

            if(!req.body.idSubject){
                throw new Errors.BadRequest(`Subject required`);
            }

            const subjectModel = new SubjectModel();
            const subject = await subjectModel.getById(Subject, req.body.idSubject);

            if(!subject){
                throw new Errors.BadRequest(`Subject required`);
            }

            delete req.body.idSubject;
            req.body.subject = subject;

            // Verificar si el rol del usuario es 1 (admin)
            if (Number(user.role) === 1) {
                if (!req.body.professor) {
                    throw new Errors.BadRequest(`Professor not found`);
                }
                professorData.id = req.body.professor;
            } else {
                professorData.where = { person: { id: user.person } };
                professorData.relations = ["person"];
            }

            // Crear una nueva instancia de ProfessorModel
            const professorModel = new ProfessorModel();

            // Obtener el profesor utilizando professorData
            const professor = await professorModel.get(Professor, professorData);

            if(!professor){
                throw new Errors.BadRequest(`Professor not found`);
            }
            
            req.body.professor = professor[0];

            const newAssignment = new Assignment(req.body);
            const errors = await validation(newAssignment);
            if(errors) {
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const assignmentModel = new AssignmentModel();
            const assignment = await assignmentModel.create(Assignment,newAssignment);
            return res.status(HTTP_STATUS.CREATED).json(assignment)
        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response> {
        try {

            if(!req.body?.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            if( (req.body.datetime_start && req.body.datetime_end) && (new Date(req.body.datetime_start) > new Date(req.body.datetime_end)) ){
                throw new Errors.BadRequest(`Datetime start must be less than datetime end`);
            }

            const assignmentModel = new AssignmentModel();
            let assignmentToUpdate = await assignmentModel.getById(Assignment, req.body.id, ["professor"]);
            delete req.body.id;

            if(!assignmentToUpdate){
                throw new Errors.BadRequest(`No assignment found`);
            }

            /*
            if(req.body.porcentage){
                const porcentage = await assignmentModel.calculatePorcentage(assignmentToUpdate.program.id);

                if(porcentage && Number(req.body.porcentage) > porcentage.porcentage && req.body.porcentage > assignmentToUpdate.porcentage){
                   return res.status(HTTP_STATUS.BAD_REQUEST).send({message: `Porcenge valid: ${porcentage.porcentage}`, "status": HTTP_STATUS.BAD_REQUEST});
                }
            }
            */

            assignmentToUpdate = Object.assign(assignmentToUpdate, req.body);
            const assignment = await assignmentModel.create(Assignment, assignmentToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(assignment);
        } catch (error) {
            return handleError(error, res);
        }
    }
}