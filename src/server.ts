import mariadb from 'mariadb';

export const pool = mariadb.createPool({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "sistema_escolar"
});