import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Model } from "../Base/model";
import { Person } from "./person.model";
import { Enrollment } from "./enrollment.model";

@Entity()
export class Student{

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Person, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_person"})
    @Index("student_FK_1")
    @IsNotEmpty({message: "Person is required"})
    person!: Person;

    @ManyToOne(() => Person, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_representative_1"})
    @Index("student_FK_2")
    @IsNotEmpty({message: "Representative is required"})
    representative1!: Person;
    
    @ManyToOne(() => Person, {createForeignKeyConstraints: true})
    @JoinColumn({name: "id_representative_2"})
    @Index("student_FK_3")
    @IsOptional()
    representative2!: Person;
    
    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type: "tinyint", nullable:false, default: 1, width: 3})
    id_status!: Number;

    @OneToMany(() => Enrollment, enrollment => enrollment.student)
    enrollments!: Enrollment[];

    constructor(data:any){
        this.person = data?.id_person;
        this.representative1 = data?.representative1;
        this.representative2 = data?.representative2;
    }

}

export class StudentModel extends Model{

}