import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {

    // Crear un proyecto
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        try {


            await project.save();
            res.status(201).json('Proyecto creado correctamente');

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear el proyecto' });
        }
    }
    // Obtener todos los proyectos
    static getAllProjects = async (req: Request, res: Response) => {
        res.send('GET Projects');
    }

}