//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm"
import { IsNotEmpty, IsDate, IsString, IsEmail, IsOptional, IsInt, IsPositive, Allow} from 'class-validator';
import { Model } from "../Base/model";
import { Student } from "./student.model";
import { Professor } from "./professor.model";

interface StudentI{
    id: number,
    cedule: number,
    name: string,
    lastName: string,
    phone: string,
    email: string,
    birthday: Date,
    id_status: number
}

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    @Allow()
    id!: number;

    @Column({ type: 'int', unique:true, nullable: false, width: 12})
    @IsNotEmpty({message: "The identification is obligatory"})
    @IsPositive({message: "The identification must be positive"})
    @IsInt({message:"The identification is not available"})
    cedule: number;

    @Column({ type: 'varchar', default: null, nullable: true, length: 60})
    @IsString()
    @IsOptional()
    name: string;

    @Column({ type: 'varchar', default: null, nullable: true, length: 60})
    @IsString()
    @IsOptional()
    lastName: string;

    @Column({ type: 'varchar', default: null, nullable: true, length: 14})
    @IsString()
    @IsOptional()
    phone: string;

    @Column({ type: 'varchar', default: null, nullable: true, length: 60})
    @IsEmail()
    @IsOptional()
    email: string;

    @Column({ type: 'date', default: null, nullable: true})
    @IsDate()
    @IsOptional()
    birthday: Date | null;

    @CreateDateColumn()
    datetime!: Date;

    @OneToOne(() => Student, student => student.person)
    student!: Student;

    @OneToOne(() => Professor, professor => professor.person)
    professor!: Professor;

    @Column({ type: 'tinyint', width: 2, default: 1, nullable: false})
    @IsInt()
    id_status!: number;

    constructor(data:StudentI) {
        this.cedule     = data?.cedule && Number(data?.cedule);
        this.name       = data?.name && data?.name.toUpperCase();
        this.lastName   = data?.lastName && data?.lastName.toUpperCase();
        this.phone      = data?.phone && String(parseInt(data?.phone));
        this.email      = data?.email;
        this.birthday   = data?.birthday && new Date(data?.birthday);
        this.id_status  = 1;
    }
}

export class PersonModel extends Model {

}