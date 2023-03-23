"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import mariadb from 'mariadb';
const typeorm_1 = require("typeorm");
const globals_1 = require("../globals");
/*
export const pool = mariadb.createPool({
    "host": DATABASE.HOST,
    "port": Number(DATABASE.PORT),
    "database": DATABASE.NAME,
    "user": DATABASE.USER,
    "password": DATABASE.PASS,
});
*/
const AppDataSource = new typeorm_1.DataSource({
    type: 'mariadb',
    host: globals_1.DATABASE.HOST,
    port: Number(globals_1.DATABASE.PORT),
    database: 'sstest',
    username: globals_1.DATABASE.USER,
    password: globals_1.DATABASE.PASS,
    entities: ['**/*.model.ts'],
    synchronize: true,
    logging: true
});
AppDataSource.initialize()
    .then(() => { console.log('DataSource initialized'); })
    .catch((error) => { console.log('DataSource failed', error); });
exports.default = AppDataSource;
