import express from 'express';
import userRouter from './Routers/user.router';
import subjectRouter from './Routers/subject.router';
import studentRouter from './Routers/student.router';
import employeeRouter from './Routers/employee.router';
import activityRouter from './Routers/activity.router';
import classroomRouter from './Routers/classroom.model';
import classroomStudentRouter from './Routers/classroomStudent.router';
import classroomProfessorRouter from './Routers/classroomProfessor.router';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/subject", subjectRouter)
app.use("/api/user", userRouter)
app.use("/api/student", studentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/activity", activityRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/classroomStudent", classroomStudentRouter);
app.use('/api/classroomProfesor', classroomProfessorRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});