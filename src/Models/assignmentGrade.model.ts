import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ObjectLiteral, DeepPartial } from "typeorm";
import { Model } from "../Base/model";
import { Assignment } from "./assignment.model";
import { Student } from "./student.model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class AssignmentGrade{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"int", nullable:false})
    id_assignment: number;

    @Column({type:"int", nullable:false})
    id_student: number;

    @Column({type:"int", nullable:false})
    grade: number;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({type:"tinyint", nullable:false, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.id_assignment = data?.get("id_assignment");
        this.id_student = data?.get("id_student");
        this.grade = data?.get("grade");;
    }
}

export class AssignmentGradeModel extends Model{

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral>{
        const assignment = await this.getById(Assignment,data.id_assignment);
        const student = await this.getById(Student,data.id_student);

        if(!assignment){
            return {error:"Assignment not found", status: HTTP_STATUS.BAD_RESQUEST}
        }
        if(!student){
            return {error:"Student not found", status: HTTP_STATUS.BAD_RESQUEST}
        }

        const assignmentGrade = await this.create(AssignmentGrade,data);
        return {assignmentGrade, status: HTTP_STATUS.CREATED}
    }

}