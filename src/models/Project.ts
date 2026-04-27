import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import Task, { TaskType } from './Task';
import { IUser } from './User';
import Note from './Note';


// para que typescript sepa que tipo de datos es el proyecto
export type ProjectType = Document & {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<TaskType & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}

// de mongo schema, es el esquema de la base de datos
const ProjectSchema = new Schema<ProjectType>({
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    clientName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    manager: {
        type: Types.ObjectId,
        ref: 'User',
    },
    team: [{
        type: Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true,
})

// Middleware
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function () {
    const projectId = this._id;
    if (!projectId) return;

    const tasks = await Task.find({ project: projectId });
    for (const task of tasks) {
        await Note.deleteMany({ task: task._id });
    }
    await Task.deleteMany({ project: projectId });
})

// definimos el modelo de proyecto, que se va a guardar en la base de datos
const Project = mongoose.model<ProjectType>('Project', ProjectSchema);

// exportamos el modelo
export default Project;