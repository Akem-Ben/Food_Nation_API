import express from 'express';
import Joi from "joi"
import bcrypt from 'bcrypt';
import {APP_SECRET} from '../configurations';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VendorPayLoad } from '../interface';


export const GenerateSalt = async() =>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt)
}

export const GenerateVerifySignature = async(regNo:string) => {
    const payload = { regNo };
    return jwt.sign(payload, APP_SECRET!, {expiresIn:'1h'})
}

export const GenerateSignature = async(payload:VendorPayLoad) => {
    return jwt.sign(payload, APP_SECRET!, {expiresIn:'1h'})
}

export const verifySignature= async(signature:string) => {
    return jwt.verify(signature, APP_SECRET!) as JwtPayload
}

export const validatePassword = async(enteredPassword:string, savedPassword:string, salt:string) => {
    return await GeneratePassword(enteredPassword,salt) === savedPassword
}