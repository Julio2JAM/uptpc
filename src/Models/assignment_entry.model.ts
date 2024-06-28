//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, Index, UpdateDateColumn, ManyToOne } from "typeorm";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, Max, Min } from "class-validator";
//Models
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
// import { Subject } from "./subject.model";
import { Classroom } from "./classroom.model";
import AppDataSource from "../database/database";
import { Enrollment } from "./enrollment.model";

interface Assignment_entryI{
    assignment: Assignment,
    // subject: Subject,
    classroom: Classroom,
    status: number,
    percentage: number,
    base: number,
}

@Entity()
export class Assignment_entry{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Assignment, {nullable: false})
    @JoinColumn({name: "id_assignment"})
    @Index("ae_FK_1")
    @IsNotEmpty({message: "Please enter an assignment"})
    assignment!: Assignment;

    /*
    @ManyToOne(() => Subject, {nullable: false})
    @JoinColumn({name: "id_subject"})
    @Index("ae_FK_2")
    @IsNotEmpty({message: "Please enter a subject"})
    subject!: Subject;
    */

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("ae_FK_3")
    @IsNotEmpty({message: "Please enter a classroom"})
    classroom!: Classroom;

    @Column({type:'tinyint', width:3, nullable:false})
    @IsInt({message:"The percentage is not numeric"})
    @Min(1,{message:"The percentage must be greater than 0"})
    @Max(100,{message:"The percentage must be less than 100"})
    percentage!: number;

    @Column({type:'tinyint', width:3, nullable:true, default: 20})
    @IsOptional()
    @IsPositive({message: 'The base of the evaluation must be greater than 0'})
    @IsInt({message:"The base is not numeric"})
    base!: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(data:Assignment_entryI){
        this.assignment = data?.assignment;
        // this.subject = data?.subject;
        this.classroom = data?.classroom;
        this.id_status = data?.status;
        this.percentage = data?.percentage;
        this.base = data?.base;
    }
}

export class Assignment_entryModel extends Model {

    /**
     * Al colocarle el porcentaje a una actividad, entre todas las que se han creado, solo debe dar como maximo
     * 100%, esta funcion retorna el porcentaje que aun se le puede asignar a una nueva actividad
     * @param idClassroom classroom identifier
     * @param idSubject subject identifier
     * @returns percentage
     */
    async calculatePercentage(idClassroom: number, idSubject: number):Promise< {percentage:number} | null >{

        const query = await AppDataSource.createQueryBuilder(Assignment_entry, "assignment_entry")
        .leftJoinAndSelect("assignment_entry.classroom", "classroom")
        .leftJoinAndSelect("assignment_entry.assignment", "assignment")
        .where("classroom.id = :idClassroom", {idClassroom: idClassroom})
        .where("assignment.id_subject = :idSubject", {idSubject: idSubject})
        .groupBy("classroom.id")
        .select("(100 - SUM(assignment_entry.percentage))", "percentage")
        .getRawOne();

        return query;

    }

    /**
     * Al colocarle el porcentaje a una actividad, entre todas las que se han creado, solo debe dar como maximo
     * 100%, esta funcion retorna el porcentaje que aun se le puede asignar a una nueva actividad
     * @param idClassroom classroom identifier
     * @param idSubject subject identifier
     * @returns percentage
     */
    async assignment_enrollment(idClassroom: number, idSubject: number[]){
        try {
            const assignment_entry = await AppDataSource.createQueryBuilder(Assignment_entry, "assignment_entry")
                .leftJoinAndSelect("assignment_entry.assignment", "assignment")
                .where("assignment_entry.id_classroom = :idClassroom", {idClassroom: idClassroom})
                .andWhere("assignment.id_subject = :idSubject", {idSubject: idSubject})
                .select([
                    "assignment.title AS title",
                    "assignment.description AS description",
                    "assignment.datetime_start AS datetime_start",
                    "assignment.datetime_end AS datetime_end",
                    "assignment.id_subject AS id_subject",
                    "assignment_entry.base AS base",
                    "assignment_entry.id AS id",
                ])
                .getRawMany();

            const enrollment = await AppDataSource.createQueryBuilder(Enrollment, "enrollment")
                .leftJoinAndSelect("enrollment.student", "student")
                .leftJoinAndSelect("student.person", "person")
                .where("enrollment.id_classroom = :idClassroom", {idClassroom: idClassroom})
                .select([
                    "enrollment.id AS id",
                    "concat(person.name, ' ', person.lastName) as fullName", 
                    "person.cedule as cedule"
                ])
                .getRawMany();

            const response = {
                'assignment_entry':assignment_entry,
                'student':enrollment,
            };

            return response;      
        } catch (error) {
            return { 'assignment_entry':null, 'student':null }
        }
    }
}