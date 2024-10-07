import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Index, ManyToOne } from "typeorm";
import { Model } from "../Base/model";
import { Enrollment } from "./enrollment.model";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";
import { Assignment_entry } from "./assignment_entry.model";

interface EvaluationI {
    assignment_entry: Assignment_entry,
    enrollment: Enrollment,
    grade: number,
    id_status?: number
}

@Entity()
export class Evaluation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Assignment_entry, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_assignment_entry" })
    @Index("evaluation_FK_1")
    @IsNotEmpty({ message: "The assignment is required" })
    assignment_entry: Assignment_entry;

    @ManyToOne(() => Enrollment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({ name: "id_enrollment" })
    @Index("evaluation_FK_2")
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
        this.assignment_entry = data?.assignment_entry;
        this.enrollment = data?.enrollment;
        this.grade = Number(data?.grade);
        this.id_status = data?.id_status ?? 1;
    }
}

export class EvaluationModel extends Model {

}