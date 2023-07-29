import axios from 'axios'
import express from 'express';
import Joi from "joi"
import bcrypt from 'bcrypt';
import {APP_SECRET} from '../configurations';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VendorPayLoad } from '../interface';


export const GenerateSalt = async() =>{
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds)
}

export const hashPassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt)
}

export const GenerateSignatureForVerify = async(regNo:string) => {
    const payload = { regNo };
    return jwt.sign(payload, APP_SECRET!, {expiresIn:'1h'})
}

export const GenerateSignature = async(payload:VendorPayLoad) => {
    return jwt.sign(payload, APP_SECRET!, {expiresIn:'1h'})
}

export const verifySignature= async(signature:string) => {
    return jwt.verify(signature, APP_SECRET!) as JwtPayload
}

export const checkPassword = async(enteredPassword:string, savedPassword:string)=>{
    return await bcrypt.compare(enteredPassword, savedPassword)
}

export const passWordGenerator = async(restaurant_name:string)=>{
    const mixup = restaurant_name += Math.floor(1000 + Math.random() * 90000)
    return mixup
}

export const axiosVerifyVendor = async (identifier:string)=>{
  try {
    const url = `https://business-name-verifier.onrender.com/company/getsingle?reg_number=${identifier}`;
    const response = await axios.get(url);
    console.log(response)
    return response.data;
  } catch (error:any) {
    // Handle the error here
    if (error.response && error.response.status === 404) {
      return "not found"; // Return an empty array to indicate no data found
    }
    throw error; // Re-throw other errors
  }
};