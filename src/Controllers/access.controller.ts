import { Access, AccessModel } from "../Models/access.model";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";
import { User, UserModel } from "../Models/user.model";
import { generateToken, verifyToken } from "../middlewares/authMiddleware";
import { matchPassword, validation } from "../Base/toolkit";

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

    async post(req: Request, res: Response):Promise<Response>{
        try {

            if(!req.body.username || !req.body.password){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Password or username incorrect", status: HTTP_STATUS.BAD_REQUEST});
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
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Password or username incorrect E1", status:HTTP_STATUS.BAD_REQUEST});
            }

            if(!user.role){
                return res.status(HTTP_STATUS.UNAUTHORIZED).json({message:"Unauthorized", status:HTTP_STATUS.UNAUTHORIZED});
            }

            const validatePassword = await matchPassword(req.body.password, user.password);
            if(!validatePassword){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Password or username incorrect E2", status:HTTP_STATUS.BAD_REQUEST});
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
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message:errors, status:HTTP_STATUS.BAD_REQUEST});
            }

            const accessModel = new AccessModel();
            const access = await accessModel.create(Access, newAccess)
            return res.status(HTTP_STATUS.CREATED).json(access);
        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }

    async verifyToken(req: Request, res: Response){
        try {
            
            const { token } = req.params;
            
            if(!token){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Token no send", status:HTTP_STATUS.BAD_REQUEST});
            }

            const validateToken = verifyToken(token);

            console.log(validateToken);

            if("error" in validateToken){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message: validateToken.error, status:HTTP_STATUS.BAD_REQUEST});
            }

            if(!validateToken.user){
                return res.status(HTTP_STATUS.BAD_REQUEST).json(validateToken);
            }
            
            const userModel = new UserModel();
            const user = await userModel.getById(User, Number(validateToken.user.id), ["role", "person"])

            if(!user){
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Corrupt user", status:HTTP_STATUS.BAD_REQUEST});
            }

            return res.status(HTTP_STATUS.OK).json(validateToken);

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}