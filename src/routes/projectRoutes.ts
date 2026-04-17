import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';


// definimos las rutas de los proyectos
const router = Router();


router.get('/', ProjectController.getAllProjects);
router.post('/', ProjectController.createProject);

// exportamos las rutas
export default router;