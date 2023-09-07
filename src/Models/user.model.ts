import { Model } from "../Base/model";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, OneToOne } from "typeorm"
import { IsNotEmpty, MinLength } from 'class-validator';
import { Role } from "./role.model";
import { Student } from "./student.model";
import { Professor } from "./professor.model";

interface LevelI{
    id: number,
    role: Role,
    username: string,
    password: string,
    student: Student;
    professor: Professor;
    id_status: number
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Role, {nullable: true})
    @JoinColumn({name: "id_level"})
    @Index("user_fk_1")
    role: Role

    @Column({type: 'varchar', length: 16, nullable: false, unique:true})
    @IsNotEmpty({message: "Please enter a username"})
    @MinLength(4)
    username: string

    @Column({type: 'varchar', length: 80, nullable: false})
    password: string

    @OneToOne(() => Student, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_student"})
    @Index("user_FK_2")
    student: Student

    @OneToOne(() => Professor, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_professor"})
    @Index("user_FK_3")
    professor: Professor

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(data:LevelI) {
        this.role = data?.role;
        this.username = data?.username;
        this.password = data?.password;
        this.student = data?.student;
        this.professor = data?.professor;
        this.id_status = 1;
    }
}

export class UserModel extends Model {

}