import type { Request, Response } from 'express';
import User from '../models/User';
import { comparePassword, hashPassword } from '../utils/auth';
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
    static confirmAccount = async (req: Request, res: Response) => {
        try {

            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                return res.status(404).json({ message: 'Token no encontrado' });
            }
            const user = await User.findById(tokenExists.user);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user.confirmed = true;

            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ]);

            res.status(200).json({ message: 'Cuenta confirmada correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al confirmar la cuenta' });
        }
    }
    static login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            if (!user.confirmed) {
                const token = new Token();
                token.user = user._id;
                token.token = generateToken();
                await token.save();
                // Enviar email de reconfirmación
                await AuthEmail.sendConfirmationEmail({ email, name: user.name, token: token.token });
                return res.status(401).json({ message: 'Cuenta no confirmada, se ha enviado un nuevo email de confirmación' });
            }
            // Revisar la contraseña
            const ispasswordCorrect = await comparePassword(password, user.password);
            if (!ispasswordCorrect) {
                return res.status(401).json({ message: 'La contraseña es incorrecta' });
            }

            return res.status(200).json({ message: 'Autenticado correctamente' });


        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {

            const { email } = req.body;

            // Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            // Generar token
            const token = new Token()
            token.token = generateToken();
            token.user = user._id;
            // Enviar email de confirmación
            await AuthEmail.sendConfirmationEmail({ email, name: user.name, token: token.token });
            // Guardar el usuario y el token
            await Promise.allSettled([user.save(), token.save()]);
            res.status(201).json({ message: 'Se ha enviado un nuevo email de confirmación' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la cuenta' });
        }
    }
    static forgotPassword = async (req: Request, res: Response) => {
        try {

            const { email } = req.body;

            // Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            // Generar token
            const token = new Token()
            token.token = generateToken();
            token.user = user._id;
            await token.save();
            // Enviar email de restablecimiento de contraseña
            await AuthEmail.sendForgotPasswordEmail({ email, name: user.name, token: token.token });

            res.status(201).json({ message: 'Se ha enviado un nuevo email de restablecimiento de contraseña' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la cuenta' });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {

            const { token } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                return res.status(404).json({ message: 'Token no encontrado' });
            }
            return res.status(200).json({ message: 'Token válido, Define tu nueva contraseña' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al validar el token' });
        }
    }
    static updatePassword = async (req: Request, res: Response) => {
        try {

            const { token } = req.params;
            const { password, confirmPassword } = req.body;
            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                return res.status(404).json({ message: 'Token no encontrado' });
            }
            const user = await User.findById(tokenExists.user);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user.password = await hashPassword(password);

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar la contraseña' });
        }
    }
}