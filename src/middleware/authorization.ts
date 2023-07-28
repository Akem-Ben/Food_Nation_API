import {Request, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_SECRET } from '../configurations';
import {VendorInstance, VendorAttributes} from '../model/vendorModels';


export const vendorauth = async(req:JwtPayload, res:Response, next:NextFunction) => {
    try{
        const authorization = req.headers.authorization

        if(!authorization){
            return res.status(401).json({
                Error: "Kindly signin"
            })
        }
        const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, APP_SECRET!)
        if(!verified){
            return res.status(401).json({
                Error: "unauthorised"
            })
        }

        const {email} = verified as {[key:string]:string}
        const user = await VendorInstance.findOne({where:{email: email}})as unknown as VendorAttributes;
        
        if(!user){
            return res.status(401).json({
                Error: "Invalid Credentials"
            })
        }
        
        req.vendor = verified 
        next()
     
    }catch(err){
        return res.status(401).json({
            Error: "unauthorised",
        })
    }
    
}

export const authVerify = async(req:JwtPayload, res:Response, next:NextFunction) => {
    try{
    const authorization = req.headers.authorization;
    if(authorization === undefined){
        return res.status(401).send({
            status: "error",
            data: "You are not authorised"
        })
    }
    const token = authorization.split(" ")[1];
    if(!token || token === ""){
        return res.status(401).send({
            status: "error",
            data: "access denied"
        })
    }
    const decoded = jwt.verify(token, `${process.env.APP_SECRET}`)
    if(!decoded) return res.status(401).send({
        status: "error",
        data: "You have not been verified"
    })
    const {regNo} = decoded as {[key:string]:string}
    req.regNo = regNo;
    return next()
} catch(err){
    console.log(err)
}
}