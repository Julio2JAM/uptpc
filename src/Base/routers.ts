//User
import userRouter from '../Routers/user.router';
import roleRouter from '../Routers/role.router';
import accessRouter from '../Routers/access.router';
//Subject
import subjectRouter from '../Routers/subject.router';
import calificationRouter from '../Routers/calification.router';
//Assignment
import assignmentRouter from '../Routers/assignment.router';
import assignment_entryRouter from '../Routers/assignment_entry.router'
import evaluationRouter from '../Routers/evaluation.router';
//Classroom
import classroomRouter from '../Routers/classroom.router';
import enrollmentRouter from '../Routers/enrollment.router';
import programRouter from '../Routers/program.router';
//Person
import personRouter from '../Routers/person.router';
import studentRouter from '../Routers/student.router';
import professorRouter from '../Routers/professor.router';

export const ROUTERS = {
    user                    : userRouter,
    access                  : accessRouter,
    subject                 : subjectRouter,
    person                  : personRouter,
    student                 : studentRouter,
    professor               : professorRouter,
    assignment              : assignmentRouter,
    assignment_entry        : assignment_entryRouter,
    evaluation              : evaluationRouter,
    classroom               : classroomRouter,
    enrollment              : enrollmentRouter,
    program                 : programRouter,
    calification            : calificationRouter,
    role                    : roleRouter,
};