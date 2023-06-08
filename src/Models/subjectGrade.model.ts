import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeepPartial, ObjectLiteral/*, OneToOne, ManyToMany */} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { ClassroomSubject } from "./classroomSubject.model";
import { Enrollment } from "./Enrollment.model";
//import { AssignmentGrade } from "./assignmentGrade.model";
//import AppDataSource from "../database/database";
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
    id_Enrollment: number;

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
        this.id_Enrollment = data?.get("id_Enrollment");
        this.grade = data?.get("grade");
    }
}

export class SubjectGradeModel extends Model {

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const classroomSubject = await this.getById(ClassroomSubject,data.id_classroomSubject);
        const Enrollment = await this.getById(Enrollment,data.id_Enrollment);

        if(!classroomSubject){
            return {error:"ClassroomSubject not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        if(!Enrollment){
            return {error:"Student not found", status:HTTP_STATUS.BAD_RESQUEST}
        }

        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

    async calculateGrade(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const classroomSubject = await this.getById(ClassroomSubject,data.id_classroomSubject);
        const Enrollment = await this.getById(Enrollment,data.id_Enrollment);
        
        if(!classroomSubject){
            return {error:"ClassroomSubject not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        if(!Enrollment){
            return {error:"Student not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        /*
        const assignment = await AppDataSource.createQueryBuilder(ClassroomSubject,"classroomSubject")
        //.leftJoinAndSelect(AssignmentGrade, "assignment", "AssignmentGrade.id_classroomSubject = classroomSubject.id")
        .leftJoinAndSelect(AssignmentGrade, "assignment", "AssignmentGrade.id_classroomSubject = classroomSubject.id")
        .getMany();
        //const assignment = await this.getById(Assignment, classroomSubject.id);
        */
        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

}