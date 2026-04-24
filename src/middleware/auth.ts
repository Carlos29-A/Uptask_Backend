import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }


    const token = bearer.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email');
            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            } else {
                req.user = user;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al autenticar' });
    }
    next();
}

