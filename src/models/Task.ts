import mongoose, { Schema, Document, Types } from 'mongoose';



const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed',
} as const;

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

// para que typescript sepa que tipo de datos es la tarea
export type TaskType = Document & {
    name: string;
    description: string;
    project: Types.ObjectId;
    status: TaskStatus;
    completeBy: Types.ObjectId;
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
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING,
    },
    completeBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null,
    }
}, {
    timestamps: true,
})

// definimos el modelo de tarea, que se va a guardar en la base de datos
export default mongoose.model<TaskType>('Task', TaskSchema);