import { transporter } from "../config/nodemailer"


interface IAuthEmail {
    email: string;
    name: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async ({ email, name, token }: IAuthEmail) => {
        await transporter.sendMail({
            from: "UpTask <no-reply@uptask.com>",
            to: email,
            subject: "Confirmación de cuenta - UpTask",
            text: "Confirmación de cuenta - UpTask",
            html: `
                <h1>Confirmación de cuenta - UpTask</h1>
                <p>Hola ${name}, bienvenido a UpTask</p>
                <p>Para confirmar tu cuenta, haz clic en el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a></p>
                <p>Tu token de confirmación es: ${token}</p>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje</p>
                <p>Este token es válido por 10 minutos</p>
                `
        })
    }
}