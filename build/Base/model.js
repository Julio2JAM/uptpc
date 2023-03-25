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
    get(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting users");
            return yield database_1.default.manager.find(entity);
        });
    }
    getById(entity, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting user by id");
            return yield database_1.default.manager.findOneBy(entity, { "id": Number(id) });
        });
    }
    create(entity, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("creating a new user");
            return yield database_1.default.manager.save(entity, data);
        });
    }
}
exports.Model = Model;
