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