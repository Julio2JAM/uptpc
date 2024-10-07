import { Access, AccessModel } from "../Models/access.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { User, UserModel } from "../Models/user.model";
import { generateToken, verifyToken } from "../middlewares/authMiddleware";
import { matchPassword, validation } from "../Base/toolkit";
import Errors, { handleError } from "../Base/errors";

export class AccessController{
    async get(_req:Request, res:Response):Promise<Response>{
        try {

            const accessModel = new AccessModel();
            const access = await accessModel.get(Access);

            if(access.length === 0){
                console.log("Access not founds");
                throw new Errors.NotFound(`Access not found`);
            }
            return res.status(HTTP_STATUS.OK).json(access);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async post(req: Request, res: Response):Promise<Response>{
        try {

            if(!req.body.username || !req.body.password){
                throw new Errors.BadRequest(`Password or username incorrect`);
            }

            const userModel = new UserModel();

            const findData = {
                where: {
                    username: req.body.username
                },
                relations: ["role"]
            }
            const [user] = await userModel.get(User,findData);
            if(!user){
                throw new Errors.BadRequest(`Password or username incorrect`);
            }

            if(!user.role){
                throw new Errors.Unauthorized(`Unauthorized`);
            }

            const validatePassword = await matchPassword(req.body.password, user.password);
            if(!validatePassword){
                throw new Errors.BadRequest(`Password or username incorrect`);
            }

            const dataAccess = {
                user: user,
                token: generateToken({user: {
                    id: user.id,
                    role: user.role.id
                }})
            }
            
            const newAccess = new Access(dataAccess);
            const errors = await validation(newAccess);
            if(errors){
                throw new Errors.BadRequest(JSON.stringify(errors));
            }

            const accessModel = new AccessModel();
            const access = await accessModel.create(Access, newAccess)
            return res.status(HTTP_STATUS.CREATED).json(access);

        } catch (error) {
            return handleError(error, res);
        }
    }

    async verifyToken(req: Request, res: Response){
        try {
            
            const { token } = req.params;
            
            if(!token){
                throw new Errors.NotFound(`Token not found`);
            }

            const validateToken = verifyToken(token);
            if("error" in validateToken){
                throw new Errors.BadRequest(validateToken.error);
            }

            // ESTUDIAR ?
            if(!validateToken.user){
                throw new Errors.BadRequest(JSON.stringify(validateToken));
            }
            
            const userModel = new UserModel();
            const user = await userModel.getById(User, Number(validateToken.user.id), ["role", "person"])

            if(!user){
                throw new Errors.BadRequest("Corrupt user");
            }
            return res.status(HTTP_STATUS.OK).json(validateToken);

        } catch (error) {
            return handleError(error, res);
        }
    }
}