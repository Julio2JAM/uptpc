import { Entity, OneToOne, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { Student } from "./student.model";
import { Profession } from "./profession.model";

@Entity()
export class Professor{
    @PrimaryGeneratedColumn()
    id!: Number;

    @OneToOne(() => Student, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_person"})
    @Index("professor_FK_1")
    @IsNotEmpty({message: "Person must be send"})
    person!: Student;

    @OneToOne(() => Profession, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_profession"})
    @Index("professor_FK_2")
    profession!: Profession;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({name: "id_status", type: "tinyint", width: 3, default: 1, nullable: false})
    id_status!: Number;

    constructor(data:any){
        this.person = data?.person;
        this.profession = data?.profession;
        this.profession = data?.id_status ?? 1;
    }
}

export class ProfessorModel extends Model{
    
}