import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from "typeorm";
import { IsNotEmpty, IsInt, Min } from "class-validator";
import { Model } from "../Base/model";
import { Program } from "./program.model";
import { Enrollment } from "./enrollment.model";
import AppDataSource from "../database/database";
import { Evaluation } from "./evaluation.model";

interface CalificationI {
    id: number,
    program: Program,
    enrollment: Enrollment,
    grade: number,
    id_status: number
}

@Entity()
export class Calification {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Program, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_program" })
    @Index("subject_grade_FK_1")
    @IsNotEmpty({ message: "The program is required" })
    program: Program;

    @OneToOne(() => Enrollment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_enrollment" })
    @Index("subject_grade_FK_2")
    @IsNotEmpty({ message: "The enrollment is required" })
    enrollment: Enrollment;

    @Column({ type: "tinyint", nullable: true, width: 3 })
    @IsNotEmpty({ message: "The grade is required" })
    @IsInt()
    @Min(0, { message: "The grade must be greater than 0" })
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: 'tinyint', width: 2, default: 1, nullable: false })
    id_status!: number;

    constructor(data: CalificationI) {
        this.program = data?.program;
        this.enrollment = data?.enrollment;
        this.grade = Number(data?.grade);
        this.id_status = data?.id_status;
    }
}

export class CalificationModel extends Model {

    async calculateGrade(id_program: number, id_student: number): Promise<{ grade: Number } > {
        const query = await AppDataSource.createQueryBuilder(Evaluation, "evaluation")
            .leftJoinAndSelect("evaluation.assignment", "assignment")
            .leftJoinAndSelect("evaluation.enrollment", "enrollment")
            .where("assignment.id_program = :id_program", { id_program: id_program })
            .andWhere("enrollment.id_student = :id_student", { id_student: id_student })
            .groupBy("enrollment.id_student")
            .select("SUM(evaluation.grade)/COUNT(evaluation.id)", "grade")
            .getRawOne();

        return query;
    }

}