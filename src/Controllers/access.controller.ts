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
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message:"Password or username incorrect", status: HTTP_STATUS.BAD_RESQUEST});
            }

            const userModel = new UserModel();
            const [user] = await userModel.get(User,{where: {username: req.body.username}});

            if(!user){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message:"Password or username incorrect", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const validatePassword = await matchPassword(req.body.password, user.password);
            if(!validatePassword){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message:"Password or username incorrect", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const dataAccess = {
                user: user,
                token: generateToken({id: user.id})
            }
            
            const newAccess = new Access(dataAccess);
            const errors = await validation(newAccess);
            if(errors){
                return res.status(HTTP_STATUS.BAD_RESQUEST).json({message:errors, status:HTTP_STATUS.BAD_RESQUEST});
            }

            const accessModel = new AccessModel();
            const access = await accessModel.create(Access, newAccess)
            console.log("Access: ", access);
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
                return res.status(HTTP_STATUS.BAD_RESQUEST).send({message:"Token no send", status:HTTP_STATUS.BAD_RESQUEST});
            }

            const validateToken = verifyToken(token);

            if(!validateToken){
                return res.status(HTTP_STATUS.OK).send({token:false});
            }

            const currentTime = Math.floor(Date.now() / 1000);
            //const currentTime = new Date(validateToken.exp * 1000);
            //const currentTimeString = currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString()
            return res.status(HTTP_STATUS.OK).send({token:(currentTime < validateToken.exp)});

        } catch (error) {
            console.error(error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({message:"Something was wrong", status:HTTP_STATUS.INTERNAL_SERVER_ERROR});
        }
    }
}