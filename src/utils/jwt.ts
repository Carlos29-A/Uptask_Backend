import jwt from 'jsonwebtoken';

interface IJWT {
    id: string;
    name: string;
    email: string;
}

export const generateJWT = ({ name, id, email }: IJWT) => {
    const token = jwt.sign({ name, id, email }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}