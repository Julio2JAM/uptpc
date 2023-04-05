import { Access, AccessModel } from "../Models/access.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export class AccessController{
    async get(_req:Request, res:Response):Promise<Response>{
        try {
            const accessModel = new AccessModel();
            const access = await accessModel.get(Access);

            if(access.length === 0){
                console.log("Access not founds");
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:'not access found', status:HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(access);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const accessModel = new AccessModel();
            const access = await accessModel.getById(Access,id);

            if(!access){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Accesss not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(access);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
    
    async post(req: Request, res: Response):Promise<Response>{
        try {

            if(!req.body.username){
                const errors = "Invalid username";
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            if(!req.body.password){
                const errors = "Invalid password";
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const accessModel = new AccessModel();
            const access = await accessModel.post_validate(req);
            console.log(access);
            if(!access){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"User not found", status:HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.CREATED).json(access);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}