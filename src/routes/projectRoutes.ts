import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors, hasAuthorization, projectExists, taskBelongsToProject, taskExists } from '../middleware';
import { TaskController } from '../controllers/TaskController';
import { authenticate } from '../middleware/auth';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';


// definimos las rutas de los proyectos
const router = Router();

// Proteger a todas las rutas de los proyectos
router.use(authenticate);

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


// rutas para las tareas
// Middleware para verificar si el proyecto existe
router.param('projectId', projectExists);

router.put('/:projectId',
    param('projectId')
        .isMongoId().withMessage('El ID no es válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProjectById
);

router.delete('/:projectId',
    param('projectId')
        .isMongoId().withMessage('El ID no es válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProjectById
);





router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
// Obtener todas las tareas de un proyecto
router.get('/:projectId/tasks',
    TaskController.getAllTasks
)

// Middleware para verificar si la tarea existe
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

// Obtener una tarea por su ID
router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('El ID de la tarea no es válido'),
    handleInputErrors,
    TaskController.getTaskById
)

// Actualizar una tarea por su ID
router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('El ID de la tarea no es válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTaskById
)

// Eliminar una tarea por su ID
router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId')
        .isMongoId().withMessage('El ID de la tarea no es válido'),
    handleInputErrors,
    TaskController.deleteTaskById
)

// Actualizar el estado de una tarea por su ID
router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('El ID de la tarea no es válido'),
    body('status')
        .notEmpty().withMessage('El estado de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateTaskStatusById
)

/** Routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().withMessage('El email no es válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

// Ruta para obtener todos los miembros del equipo
router.get('/:projectId/team',
    TeamMemberController.getTeamMembers
)

// Ruta para agregar un miembro al equipo
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('El ID del usuario no es válido'),
    handleInputErrors,
    TeamMemberController.addTeamMemberById
)

// Ruta para eliminar un miembro del equipo
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('El ID del usuario no es válido'),
    handleInputErrors,
    TeamMemberController.removeTeamMemberById
)




/** Routes for notes */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

// Ruta para obtener todas las notas de una tarea
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getAllNotes
)

// Eliminar una nota por su ID
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId')
        .isMongoId().withMessage('El ID de la nota no es válido'),
    handleInputErrors,
    NoteController.deleteNoteById
)



// exportamos las rutas
export default router;