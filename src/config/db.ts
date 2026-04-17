import dns from 'node:dns';
import mongoose from 'mongoose';
import colors from 'colors';

export const connectDB = async () => {
    try {
        // mongodb+srv:// hace lookup SRV; si el DNS del sistema rechaza la consulta (ECONNREFUSED),
        // forzar resolvedores públicos evita el fallo en muchos entornos Windows/red corporativa.
        dns.setServers(['8.8.8.8', '1.1.1.1']);

        // Conectamos a la base de datos
        const connection = await mongoose.connect(process.env.DATABASE_URL as string);
        console.log(colors.green.bold(`Conexión a la base de datos exitosa en ${connection.connection.host}`));

    } catch (error) {
        // Si hay un error, lo mostramos en consola y salimos del proceso con un codigo de error 1
        console.log(colors.red.bold('Error al conectar a la base de datos:'), error);
        process.exit(1);
    }
}