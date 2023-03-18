import express from 'express';
import userRouter from './Routers/user.router';
import subjectRouter from './Routers/subject.router';
import studentRouter from './Routers/student.router';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/subject", subjectRouter)
app.use("/api/user", userRouter)
app.use("/api/student", studentRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});