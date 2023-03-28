//Entity
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectLiteral, DeepPartial } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import AppDataSource from "../database/database";
//Models
import { Model } from "../Base/model";
import { Subject } from "./subject.model";
import { Employee } from "./employee.model";
import { Classroom } from "./classroom.model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class ClassroomSubject{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"int", nullable: false})
    @IsNotEmpty({message:"Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    id_classroom: number;

    @Column({type:"int", nullable: false})
    @IsNotEmpty({message:"Please enter a professor"})
    @IsInt({message: "The professor is not available"})
    id_professor: number;

    @Column({type:"int", nullable: false})
    @IsNotEmpty({message:"Please enter a subject"})
    @IsInt({message: "The subject is not available"})
    id_subject: number;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, default:1})
    id_status!: number;

    constructor(data:Map<any, any>){
        this.id_classroom = data?.get("id_classroom");
        this.id_professor = data?.get("id_professor");
        this.id_subject = data?.get("id_subject");
    }
}

export class ClassroomSubjectModel extends Model{

    async post_validation(dataClassroomSubject:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{

        const data: {[key:string]:ObjectLiteral|null} = {
            employee:await this.getById(Employee,dataClassroomSubject.id_professor),
            subject:await this.getById(Subject,dataClassroomSubject.id_subject),
            classroom:await this.getById(Classroom,dataClassroomSubject.id_classroom)
        };

        for(let value in data){
            if(!data[value]){
                console.log(`${value} not found`);
                return {error:`${value} not found`, status: HTTP_STATUS.BAD_RESQUEST};
            }
        }

        const classroomSubject = await this.create(ClassroomSubject, dataClassroomSubject);
        return {classroomSubject, status: HTTP_STATUS.CREATED};
    }

    async getSubject(id_professor:number){

        const employee = await this.getById(Employee,id_professor);

        if(!employee){
            return {error:`Professor not found`, status: HTTP_STATUS.BAD_RESQUEST};
        }

        const subject = await AppDataSource.manager
            .createQueryBuilder(ClassroomSubject, "classroomSubject")
            .select("subject.name")
            .leftJoinAndSelect(Subject, "subject", "subject.id = classroomSubject.id_subject")
            .where("classroomSubject.id_professor = :id", {"id":id_professor})
            .groupBy("subject.id")
            .getMany();

        console.log(`${subject}`);
        return subject;
    }
}