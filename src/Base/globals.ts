import { config } from 'dotenv';
config();

export const SERVER = {
    PORT:process.env.PORT || 3000
}

export const DATABASE = {
    NAME: process.env.DB_NAME,
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASS: process.env.BD_PASS,
    PORT: process.env.BD_PORT
}

export const ROLES = {
    "ADMIN": 1,
    "PROFESSOR": 2,
    "STUDENT": 3
};

export const ENVIROMENT = process.env.ENVIROMENT || "development";