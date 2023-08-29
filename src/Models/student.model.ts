import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Allow, IsNotEmpty, IsOptional } from "class-validator";
import { Model } from "../Base/model";
import { Person } from "./person.model";

interface StudentI{
    id: number,
    person: Person;
    representative1: Person;
    representative2: Person;
    id_status: Number;
}

@Entity()
export class Student{

    @PrimaryGeneratedColumn()
    @Allow()
    id!: number;

    @OneToOne(() => Person, {nullable: false, createForeignKeyConstraints: true, cascade: true})
    @JoinColumn({name: "id_person"})
    @Index("student_FK_1")
    @IsNotEmpty({message: "Person is required"})
    person: Person;

    @ManyToOne(() => Person, {nullable: true, createForeignKeyConstraints: true, cascade: true})
    @JoinColumn({name: "id_representative_1"})
    @Index("student_FK_2")
    @IsOptional()
    representative1: Person;
    
    @ManyToOne(() => Person, {nullable: true, createForeignKeyConstraints: true, cascade: true})
    @JoinColumn({name: "id_representative_2"})
    @Index("student_FK_3")
    @IsOptional()
    representative2: Person;
    
    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type: "tinyint", nullable:false, default: 1, width: 3})
    id_status!: Number;

    constructor(data:StudentI){
        this.person = typeof data?.person === "string" ? JSON.parse(data?.person) : data?.person;
        this.representative1 = data?.representative1;
        this.representative2 = data?.representative2;
    }

}

export class StudentModel extends Model{

}