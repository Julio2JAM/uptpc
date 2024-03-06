import { Role, RoleModel } from "../Models/role.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { removeFalsyFromObject, validation } from "../Base/toolkit";
import { Like } from "typeorm";

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
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Role not found", status: HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(role);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const newRole = new Role(req.body);
            const errors = await validation(newRole);
            
            if(errors) {
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: errors, "status": HTTP_STATUS.BAD_REQUEST});
            }

            const roleModel = new RoleModel();
            const role = await roleModel.create(Role, newRole);
            return res.status(HTTP_STATUS.CREATED).json(role);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async put(req: Request, res: Response): Promise<Response>{
        try {

            if(!req.body.id){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "invalid data", "status": HTTP_STATUS.BAD_REQUEST});
            }

            const roleModel = new RoleModel();
            let roleToUpdate = await roleModel.getById(Role, req.body.id);

            if(!roleToUpdate){
                return res.status(HTTP_STATUS.BAD_REQUEST).send({message: "invalid data", "status": HTTP_STATUS.BAD_REQUEST});
            }

            req.body.name = req.body?.name ?? roleToUpdate.name;
            req.body.code = req.body?.code ?? roleToUpdate.code;

            const newRole = new Role(req.body);
            roleToUpdate = Object.assign(roleToUpdate, newRole);
            const role = await roleModel.create(Role, roleToUpdate);
            return res.status(HTTP_STATUS.CREATED).json(role);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }    
    }
}