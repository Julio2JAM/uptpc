import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from "typeorm";
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
import { Enrollment } from "./enrollment.model";
import { IsInt, IsNotEmpty } from "class-validator";

interface AssignmentGradeI{
    id: number,
    assignment: Assignment,
    enrollment: Enrollment,
    grade: number,
    id_status: number
}

@Entity()
export class AssignmentGrade{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Assignment, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_assignment"})
    @Index("assignment_grade_FK_1")
    @IsNotEmpty({message: "The assignment is required"})
    assignment: Assignment;

    @OneToOne(() => Enrollment, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_enrollment"})
    @Index("assignment_grade_FK_2")
    @IsNotEmpty({message: "The assignment is required"})
    enrollment: Enrollment;

    @Column({type:"int", nullable:false, width:4})
    @IsNotEmpty({message: "The grade is required"})
    @IsInt({message:"The quantity is not numeric"})
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number;

    constructor(data:AssignmentGradeI) {
        this.assignment = data?.assignment;
        this.enrollment = data?.enrollment;
        this.grade = data?.grade;
    }
}

export class AssignmentGradeModel extends Model{

}