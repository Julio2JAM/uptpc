import { EntityTarget, ObjectLiteral, DeepPartial } from "typeorm";
import AppDataSource from "../database/database"


export class Model{

    async get(entity:EntityTarget<ObjectLiteral>){
        console.log("getting users");
        return await AppDataSource.manager.find(entity);
    }

    async getById(entity:EntityTarget<ObjectLiteral>, id:Number):Promise<ObjectLiteral | null>{
        console.log("getting user by id");
        return await AppDataSource.manager.findOneBy(entity,{"id":Number(id)});
    }

    async create(entity:EntityTarget<ObjectLiteral>, data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{
        console.log("creating a new user");
        return await AppDataSource.manager.save(entity,data);
    }
}