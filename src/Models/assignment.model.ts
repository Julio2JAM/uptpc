//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsOptional } from "class-validator";
//Models
import { Model } from "../Base/model";
import { Professor } from "./professor.model";
import { Subject } from "./subject.model";

interface AssignmentI{
    professor: Professor,
    subject: Subject,
    title: string,
    description: string,
    // porcentage: number,
    // base: number,
    datetime_start: Date,
    datetime_end: Date,
    status: number,
}

@Entity()
export class Assignment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Professor, {nullable: false})
    @JoinColumn({name: "id_professor"})
    @Index("assignment_FK_1")
    professor!: Professor;

    @ManyToOne(() => Subject, {nullable: false})
    @JoinColumn({name: "id_subject"})
    @Index("assignment_FK_2")
    @IsNotEmpty({message: "Please enter a subject"})
    subject!: Subject;

    @Column({type:'varchar', length:60, nullable:false})
    @IsNotEmpty({message:"The name of the assignment is not specified"})
    title: string;

    @Column({type:'varchar', length:255, nullable:true})
    @IsNotEmpty({message:"The description of the assignment is not specified"})
    description: string;

    @Column({type:'date', nullable:true})
    @IsOptional()
    datetime_start: Date;

    @Column({type:'date', nullable:true})
    @IsOptional()
    datetime_end: Date;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(data:AssignmentI){
        this.professor = data?.professor;
        this.subject = data?.subject;
        this.title = data?.title;
        this.description = data?.description;
        // this.porcentage = Number(data?.porcentage);
        // this.base = Number(data?.base);
        this.datetime_start = data?.datetime_start;
        this.datetime_end = data?.datetime_end;
    }
}

export class AssignmentModel extends Model {

}