import express from 'express';
//User
import userRouter from './Routers/user.router';
import levelRouter from './Routers/level.router';
import accessRouter from './Routers/access.router';
//Subject
import subjectRouter from './Routers/subject.router';
import subjectGradeRouter from './Routers/subjectGrade.router';
//Assignment
import assignmentRouter from './Routers/assignment.router';
import assignmentGradeRouter from './Routers/assignmentGrade.router';
//Classroom
import classroomRouter from './Routers/classroom.model';
import classroomStudentRouter from './Routers/classroomStudent.router';
import classroomSubjectRouter from './Routers/classroomSubject.router';
//Person
import studentRouter from './Routers/student.router';
import employeeRouter from './Routers/employee.router';
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
app.use("/api/student", studentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/assignmentGrade", assignmentGradeRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/classroomStudent", classroomStudentRouter);
app.use('/api/classroomProfesor', classroomSubjectRouter);
app.use('/api/subjectGrade', subjectGradeRouter);
app.use('/api/level', levelRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});