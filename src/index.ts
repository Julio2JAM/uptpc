import { ROUTERS } from './Base/routers';
import { SERVER } from './Base/globals';

// express, libreria para el servidor
import express from 'express';

//cors
import cors from 'cors';

//Se inicializa la app con express
const app = express();

// Configurar CORS para poder recibir solicitudes a la api desde cualquier origen
app.use(cors());

// Analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

for (const [key, value] of Object.entries(ROUTERS)) {
    app.use(`/api/${key}`, value);
}

app.listen(SERVER.PORT,() => {
    console.log(`Escuchando el puerto ${SERVER.PORT}`)
});