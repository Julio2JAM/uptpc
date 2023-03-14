"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UserModel = exports.User = void 0;
const database_1 = __importDefault(require("../database/database"));
const typeorm_1 = require("typeorm");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String })
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String })
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: Number })
], User.prototype, "id_status", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
class UserModel {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting users");
            return yield database_1.default.manager.find(User);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getting user by id");
            return yield database_1.default.manager.findOneBy(User, { "id": Number(id) });
        });
    }
}
exports.UserModel = UserModel;
/*import {pool} from '../database/database';
export class EstudianteModel{
    conn:any;
    async get(){
        try{
            this.conn = await pool.getConnection();
            const rows = await this.conn.query('SELECT * FROM estudiante');
            return rows;
        }catch(err){
            console.log(err);
        }finally{
            this.conn.end;
        }
    }
}
*/ 
