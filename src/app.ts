import express from 'express';
import dotenv from 'dotenv';
import {database} from './configurations';
import {HttpError} from 'http-errors';
import config from './configurations/dbConfig';

const app = express()

dotenv.config()
const { PORT } = config;
console.log(PORT)
database.sync().then(() => {
    console.log(`Database Connected`)
}).catch((err:HttpError)=>{
    console.log(err)
})





const Port = PORT


app.listen(Port, ()=>{
    console.log(`App working on Port ${PORT} Jare!`)
})


export default app