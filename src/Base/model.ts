import { EntityTarget, ObjectLiteral, DeepPartial } from "typeorm";
import AppDataSource from "../database/database"


export class Model{

    async get(entity:EntityTarget<ObjectLiteral>){
        console.log("get");
        return await AppDataSource.manager.find(entity);
    }

    /**
     * Searches for an entity in the database and returns the results as an array of objects with the properties found in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database
     * @param {ObjectLiteral} relationData - The relation of the entity from which retrieve the data from the database
     * @returns {Promise<any>} - The promise returned from the server when the data are retrieved from the database
     */
    async getRelations(entity:EntityTarget<ObjectLiteral>, relationData:ObjectLiteral): Promise<any>{ // ObjectLiteral | Null
        console.log("get relations");
        return await AppDataSource.manager.find(entity, {relations: relationData});
    }

    /**
     * Searches for an entity in the database by a specified id and returns the results as an object with the properties found in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database.
     * @param {Number} id - The id of the entity to retrieve from the database.
     * @returns {Promise<any>} - Returns the data from the database with the specified id of an entity.
     */
    async getById(entity:EntityTarget<ObjectLiteral>, id:Number): Promise<any>{
        console.log("get by id");
        return await AppDataSource.manager.findOneBy(entity,{"id":Number(id)});
    }

    /**
     * Searches in an entity in the database by a specified id and return the result as an JSON object with the properties found in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database.
     * @param {Number} id - The id of the record of an entity to retrieve the data from the database.
     * @param {ObjectLiteral} relationData - The data for the relation of an entity to retrieve the data from the database.
     * @returns - Returns the data with the relations of an entity of the database of the specified id.
     */
    async getByIdRelations(entity:EntityTarget<ObjectLiteral>, id:Number, relationData:ObjectLiteral):Promise<any>{
        console.log("get by id relations");
        return await AppDataSource.manager.findOne(entity, { where: { id: Number(id)}, relations: relationData });
    }

    /**
     * Updates and creates data of an entity in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity to which the data is stored.
     * @param {DeepPartial<ObjectLiteral>} data - The data to be stored in the entity.
     * @returns {Promise<ObjectLiteral>} Returns the data of the entity stored in the database.
     */
    async create(entity:EntityTarget<ObjectLiteral>, data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{
        console.log("creating");
        return await AppDataSource.manager.save(entity,data);
    }
}