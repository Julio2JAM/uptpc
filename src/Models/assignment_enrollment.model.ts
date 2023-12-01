//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, Index, UpdateDateColumn, ManyToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
//Models
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
import { Subject } from "./subject.model";
import { Classroom } from "./classroom.model";

interface Assignment_enrollmentI{
    assignment: Assignment,
    subject: Subject,
    classroom: Classroom,
    status: number,
}

@Entity()
export class Assignment_enrollment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Assignment, {nullable: false})
    @JoinColumn({name: "id_assignment"})
    @Index("ae_FK_1")
    @IsNotEmpty({message: "Please enter an assignment"})
    assignment!: Assignment;

    @ManyToOne(() => Subject, {nullable: false})
    @JoinColumn({name: "id_subject"})
    @Index("ae_FK_2")
    @IsNotEmpty({message: "Please enter a subject"})
    subject!: Subject;

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("ae_FK_3")
    @IsNotEmpty({message: "Please enter a classroom"})
    classroom!: Classroom;


    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(data:Assignment_enrollmentI){
        this.assignment = data?.assignment;
        this.subject = data?.subject;
        this.classroom = data?.classroom;
        this.id_status = data?.status;
    }
}

export class Assignment_enrollmentModel extends Model {

}