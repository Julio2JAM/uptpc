import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export async function dataValidator(entity:any, req: Request, res: Response, next: NextFunction){
    
    const dataToValidate = Object.assign(new entity, req.method === 'GET' ? req.params : req.body);
    const errors = await validate(dataToValidate, {
        skipMissingProperties: req.method === 'GET', 
        whitelist: true, 
        forbidNonWhitelisted: true, 
    });

    if(errors.length > 0){
        console.log(errors);
        const message = Object.fromEntries(errors.map(value => [value.property, Object.values(value.constraints!)]));
        res.status(HTTP_STATUS.BAD_RESQUEST).send({error: message, status: HTTP_STATUS.BAD_RESQUEST});
    }else{
        next();
    }
    
}