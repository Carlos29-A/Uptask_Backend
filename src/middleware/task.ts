import type { Request, Response, NextFunction } from 'express';
import { TaskType } from '../models/Task';
import Task from '../models/Task';


declare global {
    namespace Express {
        interface Request {
            task: TaskType;
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ message: error.message });
        }
        req.task = task;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al verificar el proyecto' });
    }
}

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.task.project.toString() !== req.project._id.toString()) {
            const error = new Error('La tarea no pertenece al proyecto solicitado');
            return res.status(403).json({ message: error.message });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al verificar si la tarea pertenece al proyecto' });
    }
}