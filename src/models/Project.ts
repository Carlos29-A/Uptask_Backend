import mongoose, { Schema, Document, PopulatedDoc } from 'mongoose';
import { TaskType } from './Task';


// para que typescript sepa que tipo de datos es el proyecto
export type ProjectType = Document & {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<TaskType & Document>[];
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
    }]
}, {
    timestamps: true,
})

// definimos el modelo de proyecto, que se va a guardar en la base de datos
const Project = mongoose.model<ProjectType>('Project', ProjectSchema);

// exportamos el modelo
export default Project;