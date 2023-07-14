import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, Index } from "typeorm";
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
import { Enrollment } from "./enrollment.model";
import { IsNotEmpty } from "class-validator";

@Entity()
export class AssignmentGrade{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Assignment, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_assignment"})
    @Index("assignment_grade_FK_1")
    @IsNotEmpty({message: "The assignment is required"})
    assignment!: Assignment;

    @OneToOne(() => Enrollment, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_enrollment"})
    @Index("assignment_grade_FK_2")
    @IsNotEmpty({message: "The assignment is required"})
    enrollment: Enrollment;

    @Column({type:"int", nullable:false})
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type:"tinyint", nullable:false, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        //this.assignment = data?.get("id_assignment");
        this.enrollment = data?.get("id_person");
        this.grade = data?.get("grade");
    }
}

export class AssignmentGradeModel extends Model{

}