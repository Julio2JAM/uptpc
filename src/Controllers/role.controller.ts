import { Role, RoleModel } from "../Models/role.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Like } from "typeorm";
import Errors, { handleError } from "../Base/errors";

export class RoleController{

    async get(req: Request, res: Response):Promise<Response>{
        try {

            const where = {
                name        : req.query?.name && Like(`%${req.query.name}%`),
                code        : req.query?.code && Like(`%${req.query.code}%`),
                id_status   : req.query?.id_status
            }

            const roleModel = new RoleModel();
            const role = await roleModel.get(Role, {where: removeFalsyFromObject(where)});

            if(role.length == 0){
                throw new Errors.NotFound(`Roles not found`);
            }
            return res.status(HTTP_STATUS.OK).json(role);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const newRole = new Role(req.body);
            const errors = await validation(newRole);

            if(errors) {
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const roleModel = new RoleModel();
            const role = await roleModel.create(Role, newRole);
            return res.status(HTTP_STATUS.CREATED).json(role);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async put(req: Request, res: Response): Promise<Response>{
        try {

            if(!req.body.id){
                throw new Errors.BadRequest(`Id is requered`);
            }

            const roleModel = new RoleModel();
            let roleToUpdate = await roleModel.getById(Role, req.body.id);

            if(!roleToUpdate){
                throw new Errors.BadRequest(`Role not found`);
            }

            req.body.name = req.body?.name ?? roleToUpdate.name;
            req.body.code = req.body?.code ?? roleToUpdate.code;

            const newRole = new Role(req.body);
            roleToUpdate = Object.assign(roleToUpdate, newRole);
            const role = await roleModel.create(Role, roleToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(role);

        } catch (error) {
            return handleError(error, res);
        }    
    }
}