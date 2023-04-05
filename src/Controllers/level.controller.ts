import { Level, LevelModel } from "../Models/level.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { validation } from "../Base/toolkit";

export class LevelController{

    async get(_req: Request, res: Response):Promise<Response>{
        try {
            const levelModel = new LevelModel();
            const level = await levelModel.get(Level);

            if(!level){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Level not found", status: HTTP_STATUS.NOT_FOUND});
            }
            
            return res.status(HTTP_STATUS.OK).json(level);
        } catch (error) {
            console.log(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something went wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async getById(req: Request, res: Response):Promise<Response>{
        try {
            
            const id = Number(req.params.id);
            if(!id){
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({ message:"Invalid ID", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const levelModel = new LevelModel();
            const level = await levelModel.getById(Level,id);

            if(!level){
                return res.status(HTTP_STATUS.NOT_FOUND).send({message:"Level not found", status: HTTP_STATUS.NOT_FOUND});
            }

            return res.status(HTTP_STATUS.OK).json(level);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async post(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.body;
            const newLevel = new Level(name);

            const errors = await validation(newLevel);
            if(errors) {
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message: errors, "status": HTTP_STATUS.BAD_RESQUEST});
            }

            const levelModel = new LevelModel();
            const level = levelModel.create(Level,levelModel);
            return res.status(HTTP_STATUS.CREATED).json(level);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}