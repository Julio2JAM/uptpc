import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, Index} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { Program } from "./program.model";
import { Enrollment } from "./enrollment.model";
import AppDataSource from "../database/database";
import { Evaluation } from "./evaluation.model";

interface  CalificationI{
    id: number,
    program: Program,
    enrollment: Enrollment,
    grade: number,
    id_status: number
}

@Entity()
export class Calification{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Program, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({name: "id_program"})
    @Index("subject_grade_FK_1")
    @IsNotEmpty({message: "Subject, professor and classroom are required"})
    program: Program;

    @OneToOne(() => Enrollment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({name: "id_enrollment"})
    @Index("subject_grade_FK_2")
    @IsNotEmpty({message: "The enrollment is required"})
    enrollment: Enrollment;

    @Column({type:"tinyint", nullable:true, width:3})
    @IsNotEmpty({message: "The grade is required"})
    @IsInt()
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status!: number;

    constructor(data:CalificationI) {
        this.program = data?.program;
        this.enrollment = data?.enrollment;
        this.grade = data?.grade;
        this.id_status = data?.id_status;
    }
}

export class CalificationModel extends Model {

    async validateGrade(id_program: number, id_student: number){

        const query = await AppDataSource.createQueryBuilder(Evaluation, "evaluation")
        .leftJoinAndSelect("evaluation.assignment", "assignment")
        .leftJoinAndSelect("evaluation.enrrolment", "enrrolment")
        .where("assignment.id_program = :id_program", {id_program: id_program})
        .andWhere("evaluation.grade IS NOT NULL")
        .andWhere("enrrolment.id_student = :id_student", {id_student: id_student})
        .groupBy("enrrolment.id_student")
        .select("SUM(evaluation.grade)/COUNT(evaluation.id) AS total")
        .getOne();

        return query;

    }

}