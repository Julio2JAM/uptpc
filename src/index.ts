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

const app = express();
app.use(express.json());

const PORT = 3000;

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