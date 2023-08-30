import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../Base/statusHttp";

export async function dataValidator(entity:any, req: Request, res: Response, next: NextFunction){

    //! QUERY NO PARAM!!!!!!!!
    const dataToValidate = Object.assign(new entity, req.method === 'GET' ? req.query : req.body);
    req.method === 'GET' ? req.query = dataToValidate : req.body = dataToValidate;
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