import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ObjectLiteral, DeepPartial } from "typeorm";
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

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty({message: "Please enter a classroom"})
    @IsInt({message: "The classroom is not available"})
    id_classroom!: number;

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty({message: "Please enter a student"})
    @IsInt({message: "The student is not available"})
    id_student!: number;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.id_classroom = data?.get("id_grade");
        this.id_student = data?.get("id_student");
    }
}

export class ClassroomStudentModel extends Model{

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const classroom = await this.getById(Classroom,data.id_classroom);
        const student = await this.getById(Student,data.id_student);

        /*
        //Select tomando campos especificos
        const user = await AppDataSource.manager
        .createQueryBuilder(Grade, "grade")
        .select("grade.id, grade.seccion")
        .where("id = :id", { id:1 })
        .getRawOne();
        */

        if(!classroom){
            return {error: "classroom not found", status: HTTP_STATUS.BAD_RESQUEST};
        }
        if(!student){
            return {error: "student not found", status: HTTP_STATUS.BAD_RESQUEST};
        }

        //const classroomStudent = await AppDataSource.manager.save(ClassroomStudent,data);
        const classroomStudent = await this.create(ClassroomStudent,data);
        return {classroomStudent, status:HTTP_STATUS.CREATED};
    }

}