import { EntityTarget, ObjectLiteral, DeepPartial } from "typeorm";
import AppDataSource from "../database/database"


export class Model{

    async get(entity:EntityTarget<ObjectLiteral>){
        console.log("get");
        return await AppDataSource.manager.find(entity);
    }

    async getRelations(entity:EntityTarget<ObjectLiteral>, relationData:ObjectLiteral){
        console.log("get relations");
        return await AppDataSource.manager.find(entity, {relations: relationData});
    }

    async getById(entity:EntityTarget<ObjectLiteral>, id:Number):Promise<ObjectLiteral | null>{
        console.log("get by id");
        return await AppDataSource.manager.findOneBy(entity,{"id":Number(id)});
    }

    async create(entity:EntityTarget<ObjectLiteral>, data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{
        console.log("creating");
        return await AppDataSource.manager.save(entity,data);
    }
}