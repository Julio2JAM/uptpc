import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Model } from "../Base/model";
import { Student } from "./student.model";

@Entity()
export class Student2{

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Student, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_student"})
    @Index("student_FK_1")
    @IsNotEmpty({message: "Student is required"})
    student!: Student;

    @OneToOne(() => Student, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_representative_1"})
    @Index("student_FK_2")
    @IsNotEmpty({message: "Representative is required"})
    representative1!: Student;
    
    @OneToOne(() => Student, {createForeignKeyConstraints: true})
    @JoinColumn({name: "id_representative_1"})
    @Index("student_FK_2")
    @IsOptional()
    representative2!: Student;
    
    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type: "tinyint", nullable:false, default: 1, width: 3})
    id_status!: Number;

}

export class Student2Model extends Model{

}