import express from 'express';
import dotenv from 'dotenv';
import {database} from './configurations';
import {HttpError} from 'http-errors';
import config from './configurations/dbConfig';
import cors from 'cors';
import logger from 'morgan';
import vendorRoutes from './routes/vendorRoutes'
const app = express()

dotenv.config()

const { PORT } = config;

database.sync({}).then(() => {
    console.log(`Database Connected`)
}).catch((err:HttpError)=>{
    console.log(err)
})

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use('/vendor', vendorRoutes)

const Port = PORT


app.listen(Port, ()=>{
    console.log(`App working on Port ${PORT} Jare!`)
})


export default app