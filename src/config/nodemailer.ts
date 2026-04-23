import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const config = () => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
}


export const transporter = nodemailer.createTransport(config());