import mongoose, { Schema, Document, Types } from 'mongoose';

// para que typescript sepa que tipo de datos es la tarea
export type TaskType = Document & {
    name: string;
    description: string;
    project: Types.ObjectId;
}

// definimos el esquema de la tarea 
export const TaskSchema = new Schema<TaskType>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project',
    }
}, {
    timestamps: true,
})

// definimos el modelo de tarea, que se va a guardar en la base de datos
export default mongoose.model<TaskType>('Task', TaskSchema);