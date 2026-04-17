import { Router } from 'express';
import { body } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware';


// definimos las rutas de los proyectos
const router = Router();


router.post('/',
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);

// exportamos las rutas
export default router;