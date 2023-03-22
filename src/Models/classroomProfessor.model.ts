import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ObjectLiteral, DeepPartial } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { Employee } from "./employee.model";
import { Subject } from "./subject.model";
import { Classroom } from "./classroom.model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class ClassroomProfessor{
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

export class ClassroomProfessorModel extends Model{

    async post_validation(dataClassroomProfessor:DeepPartial<ObjectLiteral>)/*:Promise<ObjectLiteral>*/{

        const data: {[key:string]:ObjectLiteral|null} = {
            employee:await this.getById(Employee,dataClassroomProfessor.id_professor),
            subject:await this.getById(Subject,dataClassroomProfessor.id_subject),
            classroom:await this.getById(Classroom,dataClassroomProfessor.id_classroom)
        };

        for(let value in data){
            if(!data[value]){
                console.log(`${value} not found`);
                return {error:`${value} not found`, status: HTTP_STATUS.NOT_FOUND};
            }
        }

        const classroomProfessor = this.create(ClassroomProfessor, dataClassroomProfessor);
        return {classroomProfessor, status: HTTP_STATUS.CREATED};
    }

}