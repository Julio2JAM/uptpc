import express from 'express';
import estudianteRouter from './Routers/estudiante.router';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/estudiante", estudianteRouter)

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});