"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//Subject
const subject_router_1 = __importDefault(require("./Routers/subject.router"));
const subjectGrade_router_1 = __importDefault(require("./Routers/subjectGrade.router"));
//Assignment
const assignment_router_1 = __importDefault(require("./Routers/assignment.router"));
const assignmentGrade_router_1 = __importDefault(require("./Routers/assignmentGrade.router"));
//Classroom
const classroom_model_1 = __importDefault(require("./Routers/classroom.model"));
const classroomStudent_router_1 = __importDefault(require("./Routers/classroomStudent.router"));
const classroomProfessor_router_1 = __importDefault(require("./Routers/classroomProfessor.router"));
//Others
const user_router_1 = __importDefault(require("./Routers/user.router"));
const student_router_1 = __importDefault(require("./Routers/student.router"));
const employee_router_1 = __importDefault(require("./Routers/employee.router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.use("/api/subject", subject_router_1.default);
app.use("/api/user", user_router_1.default);
app.use("/api/student", student_router_1.default);
app.use("/api/employee", employee_router_1.default);
app.use("/api/assignment", assignment_router_1.default);
app.use("/api/assignmentGrade", assignmentGrade_router_1.default);
app.use("/api/classroom", classroom_model_1.default);
app.use("/api/classroomStudent", classroomStudent_router_1.default);
app.use('/api/classroomProfesor', classroomProfessor_router_1.default);
app.use('/api/subjectGrade', subjectGrade_router_1.default);
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});
