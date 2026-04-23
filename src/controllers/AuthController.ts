import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/auth';

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
            await user.save();

            res.status(201).json({ message: 'Cuenta creada correctamente' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la cuenta' });
        }
    }
}