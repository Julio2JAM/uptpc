import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeepPartial, ObjectLiteral } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { ClassroomSubject } from "./classroomSubject.model";
import { Student } from "./student.model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class SubjectGrade{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"int", nullable:false})
    @IsNotEmpty({message: "Subject, professor and classroom are required"})
    @IsInt()
    id_classroomSubject: number;

    @Column({type:"int", nullable:false})
    @IsNotEmpty({message: "The student is required"})
    @IsInt()
    id_student: number;

    @Column({type:"tinyint", nullable:true, width:3})
    @IsNotEmpty({message: "The grade is required"})
    @IsInt()
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.id_classroomSubject = data?.get("id_classroomSubject");
        this.id_student = data?.get("id_student");
        this.grade = data?.get("grade");
    }
}

export class SubjectGradeModel extends Model {

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const classroomSubject = await this.getById(ClassroomSubject,data.id_classroomSubject);
        const student = await this.getById(Student,data.id_student);

        if(!classroomSubject){
            return {error:"ClassroomSubject not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        if(!student){
            return {error:"Student not found", status:HTTP_STATUS.BAD_RESQUEST}
        }

        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

}