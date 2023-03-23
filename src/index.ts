import express from 'express';
import userRouter from './Routers/user.router';
import subjectRouter from './Routers/subject.router';
import studentRouter from './Routers/student.router';
import employeeRouter from './Routers/employee.router';
import assignmentRouter from './Routers/assignment.router';
import classroomRouter from './Routers/classroom.model';
import classroomStudentRouter from './Routers/classroomStudent.router';
import classroomProfessorRouter from './Routers/classroomProfessor.router';
import subjectGradeRouter from './Routers/subjectGrade.router';

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/subject", subjectRouter)
app.use("/api/user", userRouter)
app.use("/api/student", studentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/assignment", assignmentRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/classroomStudent", classroomStudentRouter);
app.use('/api/classroomProfesor', classroomProfessorRouter);
app.use('/api/subjectGrade', subjectGradeRouter);

app.listen(PORT,() => {
    console.log(`Escuchando el puerto ${PORT}`)
});