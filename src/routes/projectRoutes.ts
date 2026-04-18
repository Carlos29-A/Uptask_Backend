import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors, projectExists } from '../middleware';
import { TaskController } from '../controllers/TaskController';


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
router.get('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    ProjectController.getProjectById);

router.put('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    ProjectController.updateProjectById
);

router.delete('/:id',
    param('id')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    ProjectController.deleteProjectById
);






// rutas para las tareas
router.post('/:projectId/tasks',
    projectExists,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
// Obtener todas las tareas de un proyecto
router.get('/:projectId/tasks',
    projectExists,
    TaskController.getAllTasks
)

// exportamos las rutas
export default router;