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

export const foodCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().required(),
    ready_time: Joi.string().required(),
    description: Joi.string().required()
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

