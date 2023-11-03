"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const database_1 = __importDefault(require("../database/database"));
class Model {
    get(entity, findData = { where: {}, relations: {} }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get");
            return yield database_1.default.manager.find(entity, findData);
        });
    }
    /**
     * Searches for an entity in the database by a specified id and returns the results as an object with the properties found in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity from which to retrieve the data from the database.
     * @param {Number} id - The id of the entity to retrieve from the database.
     * @param {Object} [relationData]
     * @returns {Promise<any>} - Returns the data from the database with the specified id of an entity.
     */
    getById(entity, id, relationData = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("get by id");
            return yield database_1.default.manager.findOne(entity, { where: { id: Number(id) }, relations: relationData });
        });
    }
    /**
     * Updates and creates data of an entity in the database.
     * @param {EntityTarget<ObjectLiteral>} entity - The entity to which the data is stored.
     * @param {DeepPartial<ObjectLiteral>} data - The data to be stored in the entity.
     * @returns {Promise<ObjectLiteral>} Returns the data of the entity stored in the database.
     */
    create(entity, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("creating");
            return yield database_1.default.manager.save(entity, data);
        });
    }
}
exports.Model = Model;
