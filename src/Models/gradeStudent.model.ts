import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ObjectLiteral, DeepPartial } from "typeorm";
import { Grade } from "../Models/grade.model";
import { Student } from "./student.model";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

@Entity()
export class GradeStudent{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty({message: "Please enter a grade"})
    @IsInt({message: "The grade is not available"})
    id_grade!: number;

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty({message: "Please enter a student"})
    @IsInt({message: "The student is not available"})
    id_student!: number;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.id_grade = data?.get("id_grade");
        this.id_student = data?.get("id_student");
    }
}

export class GradeStudentModel extends Model{

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const grade = await this.getById(Grade,data.id_grade);
        const student = await this.getById(Student,data.id_student);
        
        if(!grade){
            return {error: "grade not found", status: 404};
        }
        if(!student){
            return {error: "student not found", status: 404};
        }

        const gradeStudent = await AppDataSource.manager.save(GradeStudent,data);
        return {gradeStudent, status:200};
    }

}