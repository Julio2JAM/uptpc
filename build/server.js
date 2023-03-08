"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const mariadb_1 = __importDefault(require("mariadb"));
exports.pool = mariadb_1.default.createPool({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "sistema_escolar"
});
