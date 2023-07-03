//Entity
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectLiteral, DeepPartial, ManyToOne, JoinColumn, Index } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import AppDataSource from "../database/database";
//Models
import { Model } from "../Base/model";
import { Subject } from "./subject.model";
import { Employee } from "./employee.model";
import { Classroom } from "./classroom.model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class Program{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name:"id_classroom"})
    @Index("program_FK_1")
    @IsNotEmpty({message:"Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    classroom: Classroom;

    @ManyToOne(() => Employee, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_professor"})
    @Index("program_FK_2")
    @IsNotEmpty({message:"Please enter a professor"})
    professor: Employee;

    @Column({type:"int", nullable: false})
    @IsNotEmpty({message:"Please enter a subject"})
    subject: Subject;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, width: 3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>){
        this.classroom = data?.get("classroom");
        this.professor = data?.get("professor");
        this.subject = data?.get("subject");
    }
}

export class ProgramModel extends Model{

    async post_validation(dataProgram:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{

        const data: {[key:string]:ObjectLiteral|null} = {
            employee:await this.getById(Employee,dataProgram.id_professor),
            subject:await this.getById(Subject,dataProgram.id_subject),
            classroom:await this.getById(Classroom,dataProgram.id_classroom)
        };

        for(let value in data){
            if(!data[value]){
                console.log(`${value} not found`);
                return {error:`${value} not found`, status: HTTP_STATUS.BAD_RESQUEST};
            }
        }

        const program = await this.create(Program, dataProgram);
        return {program, status: HTTP_STATUS.CREATED};
    }

    async getSubject(id_professor:number):Promise<ObjectLiteral>{

        const employee = await this.getById(Employee,id_professor);

        if(!employee){
            return {error:`Professor not found`, status: HTTP_STATUS.BAD_RESQUEST};
        }

        const subject = await AppDataSource.manager
            .createQueryBuilder(Program, "program")
            .select("subject.name")
            .leftJoinAndSelect(Subject, "subject", "subject.id = program.id_subject")
            .where("program.id_professor = :id", {"id":id_professor})
            .groupBy("subject.id")
            .getMany();

        console.log(`${subject}`);
        return subject;
    }

    async getByParams(params:any): Promise<ObjectLiteral | null> {
        const sql = AppDataSource.manager.createQueryBuilder(Program, "program");

        if(params.classroom){
            sql.where("program.id_classroom = :classroom", {classroom: params.classroom});
        }

        if(params.subject){
            sql.andWhere("program.id_subject = :subject", {subject: params.subject});
        }

        if(params.professor){
            sql.andWhere("program.id_professor = :professor", {professor: params.professor});
        }

        const program = await sql.leftJoinAndSelect("program.classroom", "classroom")
            .leftJoinAndSelect("program.subject", "subject")
            .leftJoinAndSelect("program.professor", "professor")
            .getMany();

        return program;
    }
}