import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import React from 'react';
import VerificationEmail from '../../emails/VerificationEmail';
import ApiResponse from '@/types/ApiResponse';
export const sendVerificationEmail = async(username:string,verifyCode:string,email:string):Promise<ApiResponse>=>{
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            secure:true,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSWORD
            }
        })

        const emailHtml = await render(
            React.createElement(VerificationEmail,{username,otp:verifyCode})
        )

        const mailOptions = {
            from :process.env.USER_EMAIL,
            to:email,
            subject:"Verification Email | ProdApp",
            html:emailHtml
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('verification email sent to ',info.response)

        return {
            success:true,
            message:"verification mail sent successfully"
        }
    } catch (error) {
        console.error('error occured while sending verification email ',error);
        return{
            success:false,
            message:"error occured while sending verification email"
        }
    }
}