import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Configuramos dotenv, para que las variables de entorno se carguen en el proceso
dotenv.config();

// Conectamos a la base de datos
connectDB();
// Creamos nuestra aplicación de express
const app = express();


// Exportamos nuestra aplicacion
export default app;