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
            const task = await req.task.populate({ path: 'completeBy.user', select: 'id name email' });
            res.status(200).json(task);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener la tarea' });
        }
    }

    // Actualizar una tarea por su ID
    static updateTaskById = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;

            await req.task.save();
            res.status(200).send('Tarea actualizada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar la tarea' });
        }
    }

    // Eliminar una tarea por su ID
    static deleteTaskById = async (req: Request, res: Response) => {

        try {
            // Eliminamos la tarea del proyecto
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task._id.toString());
            // Eliminamos la tarea y actualizamos el proyecto
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.status(200).send('Tarea eliminada correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al eliminar la tarea' });
        }
    }
    // Actualizar el estado de una tarea por su ID
    static updateTaskStatusById = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            const data = {
                user: req.user._id,
                status: status,
            }
            req.task.completeBy.push(data);
            await req.task.save();
            res.status(200).send('Estado de la tarea actualizado correctamente');

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar el estado de la tarea' });
        }
    }

}