import express from 'express';
import userRouter from './Routers/user.router';

const app = express();
app.use(express.json());

const PORT = 3000;

//app.use("/api/user", userRouter)
app.use("/api/user", userRouter)

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});