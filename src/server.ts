import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/cors';
import { connectDB } from './config/db';
import projectRoutes from './routes/projectRoutes';

// Configuramos dotenv, para que las variables de entorno se carguen en el proceso
dotenv.config();

// Conectamos a la base de datos
connectDB();
// Creamos nuestra aplicación de express
const app = express();

// Habilitamos el uso de CORS
app.use(cors(corsConfig));

// Habilitamos el uso de JSON en el body de las peticiones
app.use(express.json());

// Rutas de los proyectos
app.use('/api/projects', projectRoutes);

// Exportamos nuestra aplicacion
export default app;