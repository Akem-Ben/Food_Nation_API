import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config()

const {DEV_DB_NAME,
    DEV_DB_USERNAME,
    DEV_DB_PASSWORD} = process.env

export const database = new Sequelize(
    DEV_DB_NAME!, // DB_NAME!, //database name
    DEV_DB_USERNAME!, // DB_USERNAME!, //name of user
    DEV_DB_PASSWORD!, // DB_PASSWORD!, //db password

    {
      host: "localhost",
      port: 5434,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        encrypt: true,
        // ssl: {
        //   rejectUnauthorized: false,
        // },
      },
    }
  );