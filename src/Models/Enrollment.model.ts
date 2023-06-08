import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn } from "typeorm";
import { Classroom } from "./classroom.model";
import { Student } from "./student.model";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";

@Entity()
export class Enrollment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("Enrollment_FK_1")
    @IsNotEmpty({message: "Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    classroom: Classroom;

    @ManyToOne(() => Student, {nullable:false})
    @JoinColumn({name:"id_student"})
    @Index("Enrollment_FK_2")
    @IsNotEmpty({message: "Please enter a student"})
    @IsInt({message: "The student is not available"})
    student!: Student;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.classroom = data?.get("classroom");
        this.student = data?.get("student");
    }
}

export class EnrollmentModel extends Model{

}