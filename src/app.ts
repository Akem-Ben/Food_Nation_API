import express from 'express';
import dotenv from 'dotenv';
import {db} from './configurations';
import {HttpError} from 'http-errors';
import config from './configurations/dbConfig';

const app = express()

dotenv.config()
const { PORT } = config;
console.log(PORT)
db.sync().then(() => {
    console.log(`Database Connected`)
}).catch((err:HttpError)=>{
    console.log(err)
})





const Port = PORT


app.listen(Port, ()=>{
    console.log(`App working on Port ${PORT} Jare!`)
})


export default app