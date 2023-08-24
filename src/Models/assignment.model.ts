//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ObjectLiteral, ManyToOne, JoinColumn, Index } from "typeorm";
import { IsNotEmpty, IsNumber, IsOptional, IsInt, Min, Max, IsPositive } from "class-validator";
import AppDataSource from "../database/database";
//Models
import { Program } from "./program.model";
import { AssignmentGrade } from "./assignmentGrade.model";
import { Person } from "./person.model";
import { Model } from "../Base/model";

interface AssignmentI{
    program: Program,
    name: string,
    description: string,
    porcentage: number,
    quantity: number,
    datetime_end: Date,
    status: number,
}

@Entity()
export class Assignment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Program, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("assignment_FK_1")
    @IsNotEmpty({message:"Please enter a classroom, professor and subject"})
    program!: Program;

    @Column({type:'varchar', length:60, nullable:false})
    @IsNotEmpty({message:"The name of the assignment is not specified"})
    name: string;

    @Column({type:'varchar', length:255, nullable:true})
    @IsNotEmpty({message:"The description of the assignment is not specified"})
    description: string;

    @Column({type:'tinyint', width:3, nullable:false})
    @IsNotEmpty({message:"The porcentage of the assignment is required"})
    @IsNumber()
    @IsInt({message:"The porcentage is not numeric"})
    @Min(1,{message:"The porcentage must be greater than 0"})
    @Max(100,{message:"The porcentage must be less than 100"})
    porcentage: number;

    @Column({type:'tinyint', width:3, nullable:true, default: 20})
    @IsOptional()
    @IsNumber()
    @IsPositive({message: 'The porcentage must be greater than 0'})
    @IsInt({message:"The quantity is not numeric"})
    quantity: number;

    @Column({type:'date', nullable:true})
    @IsOptional()
    datetime_end: Date;

    @CreateDateColumn()
    datetime!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(data:AssignmentI){
        this.program = data?.program;
        this.name = data?.name;
        this.description = data?.description;
        this.porcentage = data?.porcentage;
        this.quantity = data?.quantity;
        this.datetime_end = data?.datetime_end;
    }
}

export class AssignmentModel extends Model {

    async getByProgram(program:ObjectLiteral):Promise<ObjectLiteral | null>{

        const assignment = await AppDataSource.manager
            .createQueryBuilder(Assignment, "assignment")
            .leftJoinAndSelect(AssignmentGrade, "assignmentGrade", "assignmentGrade.id_assignment = assignment.id")
            .leftJoinAndSelect(Person, "person", "assignmentGrade.id_person = person.id")
            .where("assignment.program = :program", {"program":program})
            //.printSql()
            .getRawMany();

        return assignment

    }
}