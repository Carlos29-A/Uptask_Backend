import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware";


// definimos las rutas de autenticación
const router = Router();

// Crear cuenta
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


// Confirmar cuenta
router.get('/confirmar-cuenta',
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
);

// Iniciar sesión
router.post('/login',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
);


export default router;