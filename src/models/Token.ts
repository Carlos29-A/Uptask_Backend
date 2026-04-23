import mongoose, { Schema, Document, Types } from 'mongoose';


// interface para que typescript sepa que tipo de datos es el usuario
export interface IToken extends Document {
    token: string;
    user: Types.ObjectId;
    createdAt: Date;
}


// esquema de la base de datos
const tokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "10m"
    }
})

// definimos el modelo de token, que se va a guardar en la base de datos
const Token = mongoose.model<IToken>('Token', tokenSchema);
export default Token;