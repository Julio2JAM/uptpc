import { EntityTarget, ObjectLiteral, DeepPartial } from "typeorm";
import AppDataSource from "../database/database"


export class Model{

    /**
     * Search data in the database by params (conditions) and relations sends.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database.
     * @param {Object} findData 
     * @returns {Promise<ObjectLiteral>} Returns the data of the entity stored in the database.
     */
    async get(entity:EntityTarget<ObjectLiteral>, findData:Object = {where:{},relations:{}}): Promise<any>{
        console.log("get");
        return await AppDataSource.manager.find(entity, findData);
    }

    /**
     * Searches for an entity in the database by a specified id and returns the results as an object with the properties found in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database.
     * @param {Number} id - The id of the entity to retrieve from the database.
     * @param {Object} [relationData]
     * @returns {Promise<any>} - Returns the data from the database with the specified id of an entity.
     */
    async getById(entity:EntityTarget<ObjectLiteral>, id:Number, relationData:ObjectLiteral = {}): Promise<any>{
        console.log("get by id");
        return await AppDataSource.manager.findOne(entity, { where: { id: Number(id)}, relations: relationData, loadRelationIds: true });
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