//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeepPartial, ObjectLiteral } from "typeorm";
import { IsNotEmpty, IsNumber, IsOptional, IsInt, Min, Max, IsPositive } from "class-validator";
import AppDataSource from "../database/database";
//Models
import { Program } from "./program.model";
import { AssignmentGrade } from "./assignmentGrade.model";
import { Student } from "./student.model";
import { Model } from "../Base/model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class Assignment{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", nullable: false})
    @IsNotEmpty({message:"Please enter a classroom, professor and subject"})
    @IsNumber()
    @IsInt({message:"The classroom is not available"})
    id_program: number;

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

    @Column({type:'tinyint', width:2 ,default:1})
    id_status!: number

    constructor(dataAssignment:Map<any,any>){
        this.id_program = dataAssignment?.get('id_program');
        this.name = dataAssignment?.get('name');
        this.description = dataAssignment?.get('description');
        this.porcentage = dataAssignment?.get('porcentage');
        this.quantity = dataAssignment?.get('quantity');
        this.datetime_end = dataAssignment?.get('datetime_end');
    }
}

export class AssignmentModel extends Model {

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{
        const program = await this.getById(Program,data.id_program);
        if(!program){
            return {error: "The classroom, professor and subject was not found", status: HTTP_STATUS.BAD_RESQUEST};
        }
        const assignment = await this.create(Assignment, data);
        return {assignment, status: HTTP_STATUS.CREATED};
    }

    async getByProgram(id_program:number):Promise<any> /*:Promise<Object>*/{
        const program = await this.getById(Program,id_program);

        if(!program){
            return {error:"Not found", status: HTTP_STATUS.BAD_RESQUEST}
        }

        const assignment = await AppDataSource.manager
            .createQueryBuilder(Assignment, "assignment")
            .select("assignment.name, assignmentGrade.grade, student.name")
            .leftJoinAndSelect(AssignmentGrade, "assignmentGrade", "assignmentGrade.id_assignment = assignment.id")
            .leftJoinAndSelect(Student, "student", "assignmentGrade.id_student = student.id")
            .where("assignment.id_program = :id", {"id":id_program})
            //.printSql()
            .getRawMany();

        console.log(assignment);
    }
}