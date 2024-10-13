//import mariadb from 'mariadb';
import { DataSource } from 'typeorm';
import { DATABASE, ENVIROMENT } from '../Base/globals';
/*
export const pool = mariadb.createPool({
    "host": DATABASE.HOST,
    "port": Number(DATABASE.PORT),
    "database": DATABASE.NAME,
    "user": DATABASE.USER,
    "password": DATABASE.PASS,
});
*/
const AppDataSource = new DataSource({
    type: 'mariadb',
    host: DATABASE.HOST,
    port: Number(DATABASE.PORT),
    database: 'uptpc',//DATABASE.NAME,
    username: DATABASE.USER,
    password: DATABASE.PASS,
    entities: [ENVIROMENT == 'production' ? "**/*.model.js" : "**/*.model.ts"],
    synchronize: false,
    logging: false
});

AppDataSource.initialize()
    .then(()=>{ console.log('DataSource initialized'); })
    .catch((error)=>{ console.log('DataSource failed',error) });

export default AppDataSource;