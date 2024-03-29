//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn } from "typeorm";
import { IsNotEmpty, IsOptional, /*IsInt,  Min, Max, IsPositive*/ } from "class-validator";
//Models
// import { Program } from "./program.model";
import { Model } from "../Base/model";
import AppDataSource from "../database/database";
import { Professor } from "./professor.model";

interface AssignmentI{
    // program: Program,
    professor: Professor,
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

    /* 
    @ManyToOne(() => Program, {nullable: false})
    @JoinColumn({name: "id_program"})
    @Index("assignment_FK_1")
    @IsNotEmpty({message:"Please enter a classroom, professor and subject"})
    program!: Program;
    */

    @ManyToOne(() => Professor, {nullable: false})
    @JoinColumn({name: "id_professor"})
    @Index("assignment_FK_1")
    professor!: Professor;

    @Column({type:'varchar', length:60, nullable:false})
    @IsNotEmpty({message:"The name of the assignment is not specified"})
    title: string;

    @Column({type:'varchar', length:255, nullable:true})
    @IsNotEmpty({message:"The description of the assignment is not specified"})
    description: string;

    /* 
    @Column({type:'tinyint', width:3, nullable:false})
    @IsInt({message:"The porcentage is not numeric"})
    @Min(1,{message:"The porcentage must be greater than 0"})
    @Max(100,{message:"The porcentage must be less than 100"})
    porcentage: number;

    @Column({type:'tinyint', width:3, nullable:true, default: 20})
    @IsOptional()
    @IsPositive({message: 'The base of the evaluation must be greater than 0'})
    @IsInt({message:"The base is not numeric"})
    base: number;
    */

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
        // this.program = data?.program;
        this.professor = data?.professor;
        this.title = data?.title;
        this.description = data?.description;
        // this.porcentage = Number(data?.porcentage);
        // this.base = Number(data?.base);
        this.datetime_start = data?.datetime_start;
        this.datetime_end = data?.datetime_end;
    }
}

export class AssignmentModel extends Model {

    /**
     * Al colocarle el porcentaje a una actividad, entre todas las que se han creado, solo debe dar como maximo
     * 100%, esta funcion retorna el porcentaje que aun se le puede asignar a una nueva actividad
     * @param id_program program identifier
     * @returns porcentage
     */
    async calculatePorcentage(id_program: number):Promise< {porcentage:number} | null >{
        const query = await AppDataSource.createQueryBuilder(Assignment, "assignment")
        .leftJoinAndSelect("assignment.program", "program")
        .where("program.id = :id_program", {id_program: id_program})
        .groupBy("program.id")
        .select("(100 - SUM(assignment.porcentage))", "porcentage")
        .getRawOne();

        return query;
    }
}