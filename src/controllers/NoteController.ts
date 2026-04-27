import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';
import { Types } from 'mongoose';

type NoteParams = {
    noteId: Types.ObjectId;
}


export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body;
        const note = new Note()
        note.content = content;
        note.createdBy = req.user._id;
        note.task = req.task._id;
        req.task.notes.push(note._id);

        try {

            await Promise.allSettled([note.save(), req.task.save()]);
            res.status(201).json({ message: 'Nota creada correctamente' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al crear la nota' });
        }
    }
    static getAllNotes = async (req: Request, res: Response) => {
        try {

            const notes = await Note.find({ task: req.task._id });
            res.status(200).json(notes);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al obtener las notas' });
        }
    }
    static deleteNoteById = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);

        // Verificar si la nota existe
        if (!note) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }
        // Verificar si la persona que esta eliminando la nota es el creador de la nota
        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'No tienes permisos para eliminar esta nota' });
        }

        // Eliminar la nota y actualizar la tarea
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());
        try {
            await Promise.allSettled([note.deleteOne(), req.task.save()]);
            res.status(200).json({ message: 'Nota eliminada correctamente' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al eliminar la nota' });
        }


    }
}