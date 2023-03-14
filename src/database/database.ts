//import mariadb from 'mariadb';
import { DataSource } from 'typeorm';
import { DATABASE } from '../globals';
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
    database: 'sstest',//DATABASE.NAME,
    username: DATABASE.USER,
    password: DATABASE.PASS,
    entities: ['**/*.model.js'],
    synchronize: true,
    logging: true
});

AppDataSource.initialize()
    .then(()=>{ console.log('DataSource initialized'); })
    .catch((err)=>{ console.log('DataSource failed',err) });

export default AppDataSource;