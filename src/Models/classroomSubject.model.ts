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
export class ClassroomSubject{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false, createForeignKeyConstraints: true})
    @JoinColumn({name:"id_classroom"})
    @Index("classroomSubject_FK_1")
    @IsNotEmpty({message:"Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    classroom: Classroom;

    @ManyToOne(() => Employee, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_professor"})
    @Index("classroomSubject_FK_2")
    @IsNotEmpty({message:"Please enter a professor"})
    @IsInt({message: "The professor is not available"})
    professor: Employee;

    @Column({type:"int", nullable: false})
    @IsNotEmpty({message:"Please enter a subject"})
    @IsInt({message: "The subject is not available"})
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

    async getSubject(id_professor:number):Promise<ObjectLiteral>{

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