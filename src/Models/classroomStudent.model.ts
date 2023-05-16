import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ObjectLiteral, DeepPartial, ManyToOne, JoinColumn, Index, UpdateDateColumn } from "typeorm";
import { Classroom } from "./classroom.model";
import { Student } from "./student.model";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { HTTP_STATUS } from "../Base/statusHttp";
//import AppDataSource from "../database/database";

@Entity()
export class ClassroomStudent{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("classroomStudent_FK_1")
    @IsNotEmpty({message: "Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    classroom: Classroom;

    @ManyToOne(() => Student, {nullable:false})
    @JoinColumn({name:"id_student"})
    @Index("classroomStudent_FK_2")
    @IsNotEmpty({message: "Please enter a student"})
    @IsInt({message: "The student is not available"})
    student!: Student;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.classroom = data?.get("classroom");
        this.student = data?.get("student");
    }
}

export class ClassroomStudentModel extends Model{

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const classroom = await this.getById(Classroom,data.id_classroom);
        const student = await this.getById(Student,data.id_student);

        if(!classroom){
            return {error: "classroom not found", status: HTTP_STATUS.BAD_RESQUEST};
        }
        if(!student){
            return {error: "student not found", status: HTTP_STATUS.BAD_RESQUEST};
        }

        const classroomStudent = await this.create(ClassroomStudent,data);
        return {classroomStudent, status:HTTP_STATUS.CREATED};
    }

}