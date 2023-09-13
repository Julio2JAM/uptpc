import express from 'express';
//User
import userRouter from './Routers/user.router';
import roleRouter from './Routers/role.router';
import accessRouter from './Routers/access.router';
//Subject
import subjectRouter from './Routers/subject.router';
import calificationRouter from './Routers/calification.router';
//Assignment
import assignmentRouter from './Routers/assignment.router';
import evaluationRouter from './Routers/evaluation.router';
//Classroom
import classroomRouter from './Routers/classroom.router';
import enrollmentRouter from './Routers/enrollment.router';
import programRouter from './Routers/program.router';
//Person
import personRouter from './Routers/person.router';
import studentRouter from './Routers/student.router';
import professorRouter from './Routers/professor.router';
//cors
import cors from 'cors';

//Se inicializa la app con express
const app = express();

// Configurar CORS para poder recibir solicitudes a la api desde cualquier origen
app.use(cors());

// Analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

//Puerto en cual se van a correr la api
const PORT = 3000;

//Todas las direcciones que maneja la api
app.use("/api/user", userRouter)
app.use("/api/access", accessRouter)
app.use("/api/subject", subjectRouter)
app.use("/api/person", personRouter);
app.use('/api/student', studentRouter);
app.use('/api/professor', professorRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/evaluation", evaluationRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use('/api/program', programRouter);
app.use('/api/calification', calificationRouter);
app.use('/api/role', roleRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});