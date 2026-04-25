import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {

    // Crear un proyecto
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        // Asignamos el manager al proyecto
        project.manager = req.user._id;

        try {
            // Guardamos el proyecto en la base de datos
            await project.save();
            res.status(201).json('Proyecto creado correctamente');

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear el proyecto' });
        }
    }
    // Obtener todos los proyectos
    static getAllProjects = async (req: Request, res: Response) => {
        try {

            // Buscamos todos los proyectos en la base de datos
            const projects = await Project.find({
                $or: [
                    { manager: req.user._id },
                    { team: req.user._id },
                ]
            });

            res.status(200).json(projects);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener los proyectos' });
        }
    }
    // Obtener un proyecto por su ID
    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Buscamos el proyecto por su ID en la base de datos
            const project = await Project.findById(id).populate('tasks');

            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }
            // Verificamos si el manager del proyecto es el usuario autenticado
            if (project.manager.toString() !== req.user._id.toString() && !req.project.team.includes(req.user._id)) {
                return res.status(403).json({ message: 'No tienes permisos para acceder a este proyecto' });
            }

            res.status(200).json(project);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener el proyecto' });
        }
    }
    // Actualizar un proyecto por su ID
    static updateProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { projectName, clientName, description } = req.body;
        try {
            // Buscamos el proyecto por su ID en la base de datos
            const project = await Project.findByIdAndUpdate(id, { projectName, clientName, description }, { new: true });

            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }
            // Verificamos si el manager del proyecto es el usuario autenticado
            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'No tienes permisos para actualizar este proyecto' });
            }

            res.status(200).json('Proyecto actualizado correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al actualizar el proyecto' });
        }
    }
    // Eliminar un proyecto por su ID
    static deleteProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            // Buscamos el proyecto por su ID en la base de datos
            const project = await Project.findByIdAndDelete(id);
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }
            // Verificamos si el manager del proyecto es el usuario autenticado
            if (project.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'No tienes permisos para eliminar este proyecto' });
            }
            res.status(200).json('Proyecto eliminado correctamente');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al eliminar el proyecto' });
        }
    }
}