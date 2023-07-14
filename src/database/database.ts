//import mariadb from 'mariadb';
import { DataSource } from 'typeorm';
import { DATABASE } from '../Base/globals';
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
    database: 'sstest2',//DATABASE.NAME,
    username: DATABASE.USER,
    password: DATABASE.PASS,
    entities: ['**/*.model.ts'],
    synchronize: true,
    logging: true
});

AppDataSource.initialize()
    .then(()=>{ console.log('DataSource initialized'); })
    .catch((error)=>{ console.log('DataSource failed',error) });

export default AppDataSource;