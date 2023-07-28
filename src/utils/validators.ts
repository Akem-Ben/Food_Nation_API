import Joi from "joi"
import bcrypt from 'bcrypt';
import { APP_SECRET } from '../configurations';
import jwt, { JwtPayload } from 'jsonwebtoken'

export const vendorSchema = Joi.object().keys({
    email: Joi.string().required(),
    phone_no: Joi.string().required(),
    name_of_owner: Joi.string().required(),
    restaurant_name: Joi.string().required(),
    address: Joi.string().required(),
    cover_image: Joi.string().required(),
})
export const updateSchema = Joi.object().keys({
    email: Joi.string().optional(),
    restaurant_name: Joi.string().optional(),
    name_of_owner: Joi.string().optional(),
    address: Joi.string().optional(),
    phone_no: Joi.string().optional(),
    cover_image: Joi.string().optional()
})
export const forgotSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

export const option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}

export const SaltGenerator = async()=>{
    return bcrypt.genSalt()
}

export const passWordGenerator = async(restaurant_name:string)=>{
    const mixup = restaurant_name += Math.floor(1000 + Math.random() * 90000)
    return mixup
}

export const hashPassword = async (password:string, salt:string)=>{
    return await bcrypt.hash(password, salt)
}