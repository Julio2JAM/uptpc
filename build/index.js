"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//User
const user_router_1 = __importDefault(require("./Routers/user.router"));
const role_router_1 = __importDefault(require("./Routers/role.router"));
const access_router_1 = __importDefault(require("./Routers/access.router"));
//Subject
const subject_router_1 = __importDefault(require("./Routers/subject.router"));
const calification_router_1 = __importDefault(require("./Routers/calification.router"));
//Assignment
const assignment_router_1 = __importDefault(require("./Routers/assignment.router"));
const evaluation_router_1 = __importDefault(require("./Routers/evaluation.router"));
//Classroom
const classroom_router_1 = __importDefault(require("./Routers/classroom.router"));
const enrollment_router_1 = __importDefault(require("./Routers/enrollment.router"));
const program_router_1 = __importDefault(require("./Routers/program.router"));
//Person
const person_router_1 = __importDefault(require("./Routers/person.router"));
const student_router_1 = __importDefault(require("./Routers/student.router"));
const professor_router_1 = __importDefault(require("./Routers/professor.router"));
//cors
const cors_1 = __importDefault(require("cors"));
//Se inicializa la app con express
const app = (0, express_1.default)();
// Configurar CORS para poder recibir solicitudes a la api desde cualquier origen
app.use((0, cors_1.default)());
// Analizar el cuerpo de las solicitudes como JSON
app.use(express_1.default.json());
//Puerto en cual se van a correr la api
const PORT = 3000;
//Todas las direcciones que maneja la api
app.use("/api/user", user_router_1.default);
app.use("/api/access", access_router_1.default);
app.use("/api/subject", subject_router_1.default);
app.use("/api/person", person_router_1.default);
app.use('/api/student', student_router_1.default);
app.use('/api/professor', professor_router_1.default);
app.use("/api/assignment", assignment_router_1.default);
app.use("/api/evaluation", evaluation_router_1.default);
app.use("/api/classroom", classroom_router_1.default);
app.use("/api/enrollment", enrollment_router_1.default);
app.use('/api/program', program_router_1.default);
app.use('/api/calification', calification_router_1.default);
app.use('/api/role', role_router_1.default);
app.listen(PORT, () => {
    console.log(`Escuchando el puerto ${PORT}`);
});
