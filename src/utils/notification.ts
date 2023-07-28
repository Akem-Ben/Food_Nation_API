import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {GMAI_USER,
    GMAIL_PASSWORD} from '../configurations'

dotenv.config()

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAI_USER!,
        pass: GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const sendmail = async(from:string, to:string, subject:string, html:string)=>{
    try{
        const reponse = await transporter.sendMail({
            from: "abn4reel@gmail.com",
            to,
            subject: "Welcome",
            html
        })
    }catch(err){
        console.log(err)
    }
}

export const emailHtml = (email:string, password:string)=>{
    const mail = `<h1>Welcome<h1>
                    <p>You username: ${email}</p><br>
                    <p>Your Password: ${password}</p><br>
                    <p>Thank You</p>`

                    return mail
}