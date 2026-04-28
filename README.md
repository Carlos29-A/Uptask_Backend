# UpTask API

API REST hecha con Node, Express, TypeScript y MongoDB. Sirve para el proyecto UpTask: usuarios, proyectos, tareas, notas, equipo y autenticación con JWT.

## Cómo ejecutarla

1. Instala dependencias:

   `npm install`

2. Crea un archivo `.env` en la raíz. Copia el contenido de `.env.example` y completa los valores.

3. Rellena al menos `DATABASE_URL` con la cadena de conexión de tu base MongoDB. El resto (correo, JWT, front) según vayas a usar confirmación de cuenta, correos o el frontend.

4. Levanta el servidor en modo desarrollo:

   `npm run dev`

5. La API queda en `http://localhost:4000` (o en el `PORT` que definas en `.env`).

Con eso el backend debería arrancar y conectar a la base. Si falla, revisa que `DATABASE_URL` sea correcta y que MongoDB esté accesible.
