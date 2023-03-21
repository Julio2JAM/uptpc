import express from 'express';
import userRouter from './Routers/user.router';
import subjectRouter from './Routers/subject.router';
import studentRouter from './Routers/student.router';
import employeeRouter from './Routers/employee.router';
import activityRouter from './Routers/activity.router';
import gradeRouter from './Routers/grade.model';
import gradeStudentRouter from './Routers/gradeStudent.router';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/subject", subjectRouter)
app.use("/api/user", userRouter)
app.use("/api/student", studentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/activity", activityRouter);
app.use("/api/grade", gradeRouter);
app.use("/api/gradeStudent", gradeStudentRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});