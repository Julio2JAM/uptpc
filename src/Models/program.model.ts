//Entity
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
//Models
import { Model } from "../Base/model";
import { Subject } from "./subject.model";
import { Professor } from "./professor.model";
import { Classroom } from "./classroom.model";
import AppDataSource from "../database/database";

interface ProgramI{
    id: number,
    idClassroom: Classroom,
    idProfessor: Professor,
    idSubject: Subject,
    id_status: number
}

@Entity()
export class Program{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name:"id_classroom"})
    @Index("program_FK_1")
    @IsNotEmpty({message:"Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    classroom: Classroom;

    //* SE PUEDE CAMBIAR, TENIENDO SOLO CLASSROOM Y SUBJECT, Y DESPUES UNA TABLA APARTE DONDE SE ASIGNEN LOS PROFESORES
    @ManyToOne(() => Professor, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_professor"})
    @Index("program_FK_2")
    @IsNotEmpty({message:"Please enter a professor"})
    professor: Professor;

    @ManyToOne(() => Subject, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_subject"})
    @Index("program_FK_3")
    @IsNotEmpty({message:"Please enter a subject"})
    subject: Subject;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, width: 3, default:1})
    id_status!: number;

    constructor(data:ProgramI){
        this.classroom = data?.idClassroom;
        this.professor = data?.idProfessor;
        this.subject = data?.idSubject;
    }
}

export class ProgramModel extends Model{

    async subjects(idProfessor: number){

        const subjects = await AppDataSource.createQueryBuilder(Subject, "subject")
        .leftJoinAndSelect(Program, "program", "program.id_subject = subject.id")
        .where("program.id_professor = :idProfessor", {idProfessor: idProfessor})
        .getMany();

        return subjects;

    }

}