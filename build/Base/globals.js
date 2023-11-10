"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENVIROMENT = exports.DATABASE = exports.SERVER = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.SERVER = {
    PORT: process.env.PORT || 3000
};
exports.DATABASE = {
    NAME: process.env.DB_NAME,
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASS: process.env.BD_PASS,
    PORT: process.env.BD_PORT
};
exports.ENVIROMENT = process.env.ENVIROMENT || "development";
