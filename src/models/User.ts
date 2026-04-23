import mongoose, { Schema, Document } from 'mongoose';


// interface para que typescript sepa que tipo de datos es el usuario
export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    confirmed: boolean;
}

// esquema de la base de datos
const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

// definimos el modelo de usuario, que se va a guardar en la base de datos
const User = mongoose.model<IUser>('User', userSchema);
export default User;