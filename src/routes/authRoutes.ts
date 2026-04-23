import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware";


// definimos las rutas de autenticación
const router = Router();

router.post('/create-account',

    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    handleInputErrors,
    AuthController.createAccount);


export default router;