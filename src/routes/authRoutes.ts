import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware";
import { authenticate } from "../middleware/auth";


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
router.post('/confirm-account',
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
// Solicitar código de confirmación
router.post('/request-code',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);

// Restablecer contraseña
router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.forgotPassword
);

// Validar token
router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.validateToken
);
// Restablecer contraseña
router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('El token debe ser un número'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    handleInputErrors,
    AuthController.updatePassword
)

router.get('/user',
    authenticate,
    AuthController.user
)

/*Profile */
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    AuthController.updateProfile
)
router.post('/update-password',
    authenticate,
    body('currentPassword')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router;