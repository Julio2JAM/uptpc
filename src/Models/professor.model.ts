import { Entity, OneToOne, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { Person } from "./person.model";

interface ProfessorI{
    id: Number,
    person: Person,
    id_status: Number
}

@Entity()
export class Professor{
    @PrimaryGeneratedColumn()
    id!: Number;

    @OneToOne(() => Person, {nullable: false, createForeignKeyConstraints: true, cascade: true})
    @JoinColumn({name: "id_person"})
    @Index("professor_FK_1")
    @IsNotEmpty({message: "Person must be send"})
    person!: Person;

    /*@OneToOne(() => Profession, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_profession"})
    @Index("professor_FK_2")
    profession!: Profession;*/

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: Number;

    constructor(data:ProfessorI){
        this.person = data?.person;
        //this.profession = data?.profession;
        this.id_status = data?.id_status ?? 1;
    }
}

export class ProfessorModel extends Model{

}