import type { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import { isValidObjectId } from 'mongoose';


export class TaskController {
    // Crear una tarea
    static createTask = async (req: Request, res: Response) => {
        try {
            const project = req.project;
            // Creamos la tarea
            const task = new Task(req.body);
            task.project = project._id;
            project.tasks.push(task._id);
            await Promise.allSettled([task.save(), project.save()]);
            res.send('Tarea creada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la tarea' });
        }
    }
    // Obtener todas las tareas de un proyecto
    static getAllTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project._id }).populate('project');
            res.status(200).json(tasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener las tareas' });
        }
    }

    // Obtener una tarea por su ID
    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId).populate('project');
            if (!task) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }
            // Verificar si la tarea su proyecto es el mismo del proyecto que se está solicitando
            if (task.project.toString() !== req.project._id.toString()) {
                return res.status(403).json({ message: 'La tarea no pertenece al proyecto' });
            }
            res.status(200).json(task);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener la tarea' });
        }
    }

    // Actualizar una tarea por su ID
    static updateTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true }).populate('project');
            if (!task) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }
            // Verificar si la tarea su proyecto es el mismo del proyecto que se está solicitando
            if (task.project.toString() !== req.project._id.toString()) {
                return res.status(403).json({ message: 'La tarea no pertenece al proyecto solicitado' });
            }
            res.status(200).json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar la tarea' });
        }
    }
}