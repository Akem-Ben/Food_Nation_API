import dotenv from 'dotenv';

dotenv.config()

const {DEV_PORT,
    DEV_DB_NAME,
    DEV_DB_USERNAME,
    DEV_DB_PASSWORD,
    DEV_DB_HOST,
    DEV_DB_PORT} = process.env


export default {
    PORT:DEV_PORT,
    DB_NAME:DEV_DB_NAME,
    DB_USERNAME:DEV_DB_USERNAME,
    DB_PASSWORD:DEV_DB_PASSWORD,
    DB_HOST:DEV_DB_HOST,
    DB_PORT:DEV_DB_PORT
}

console.log('running in dev mode')