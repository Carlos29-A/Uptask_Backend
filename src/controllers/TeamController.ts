import type { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';


export class TeamMemberController {

    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        //Find User
        const user = await User.findOne({ email }).select('_id name email');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    }
    static addTeamMemberById = async (req: Request, res: Response) => {
        const { id } = req.body;
        // Find User
        const user = await User.findById(id).select('_id');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar si el usuario ya está en el equipo
        if (req.project.team.some(teamMember => teamMember.toString() === user._id.toString())) {
            return res.status(400).json({ message: 'Usuario ya está en el equipo' });
        }
        // Guardar el usuario en el equipo
        req.project.team.push(user._id);
        await req.project.save();
        res.status(200).json({ message: 'Usuario agregado al equipo correctamente' });

    }
    static removeTeamMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params;

        // Verificar si el usuario ya está en el equipo
        if (!req.project.team.some(teamMember => teamMember.toString() === userId.toString())) {
            return res.status(400).json({ message: 'Usuario no está en el equipo' });
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId.toString());
        await req.project.save();
        res.status(200).json({ message: 'Usuario eliminado del equipo correctamente' });
    }
    static getTeamMembers = async (req: Request, res: Response) => {
        const project = await Project.findById(req.params.projectId).populate({
            path: 'team',
            select: '_id name email',
        });
        res.json(project.team);
    }
}