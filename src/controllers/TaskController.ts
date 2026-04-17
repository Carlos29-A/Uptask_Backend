import type { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';


export class TaskController {
    // Crear una tarea
    static createTask = async (req: Request, res: Response) => {
        // Obtenemos el ID del proyecto
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        try {

            // Creamos la tarea
            const task = new Task(req.body);
            task.project = project._id;
            project.tasks.push(task._id);
            await task.save();
            await project.save();
            res.send('Tarea creada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la tarea' });
        }
    }
}