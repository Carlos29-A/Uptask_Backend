import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {

            const { password, email } = req.body;

            // Prevenir duplicados
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(409).json({ message: 'El email ya está registrado' });
            }

            // Crear el usuario
            const user = new User(req.body);
            // Hashear la contraseña
            user.password = await hashPassword(password);

            // Generar token
            const token = new Token()
            token.token = generateToken();
            token.user = user._id;

            // Enviar email de confirmación
            await AuthEmail.sendConfirmationEmail({ email, name: user.name, token: token.token });

            // Guardar el usuario y el token
            await Promise.allSettled([user.save(), token.save()]);


            res.status(201).json({ message: 'Cuenta creada correctamente, revisa tu email para confirmar tu cuenta' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la cuenta' });
        }
    }
}