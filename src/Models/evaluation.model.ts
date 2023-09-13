import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from "typeorm";
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
import { Enrollment } from "./enrollment.model";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

interface EvaluationI {
    id: number,
    assignment: Assignment,
    enrollment: Enrollment,
    grade: number,
    id_status: number
}

@Entity()
export class Evaluation {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Assignment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_assignment" })
    @Index("assignment_grade_FK_1")
    @IsNotEmpty({ message: "The assignment is required" })
    assignment: Assignment;

    @OneToOne(() => Enrollment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_enrollment" })
    @Index("assignment_grade_FK_2")
    @IsNotEmpty({ message: "The enrollment is required" })
    enrollment: Enrollment;

    @Column({ type: "tinyint", nullable: true, width: 4 })
    @IsNotEmpty({ message: "The grade is required" })
    @IsInt({ message: "The grade must be a integer" })
    @IsPositive({ message: "The grade must be a positive number" })
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false })
    id_status!: number;

    constructor(data: EvaluationI) {
        this.assignment = data?.assignment;
        this.enrollment = data?.enrollment;
        this.grade = Number(data?.grade);
        this.id_status = data?.id_status;
    }
}

export class EvaluationModel extends Model {

}