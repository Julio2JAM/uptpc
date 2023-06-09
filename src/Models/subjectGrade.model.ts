import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeepPartial, ObjectLiteral/*, OneToOne, ManyToMany */} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { Program } from "./program.model";
import { Enrollment } from "./enrollment.model";
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
    id_program: number;

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
        this.id_program = data?.get("id_program");
        this.id_Enrollment = data?.get("id_Enrollment");
        this.grade = data?.get("grade");
    }
}

export class SubjectGradeModel extends Model {

    async post_validation(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const program = await this.getById(Program,data.id_program);
        const enrollment = await this.getById(Enrollment,data.id_Enrollment);

        if(!program){
            return {error:"Program not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        if(!enrollment){
            return {error:"Student not found", status:HTTP_STATUS.BAD_RESQUEST}
        }

        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

    async calculateGrade(data:DeepPartial<ObjectLiteral>):Promise<ObjectLiteral> {
        const program = await this.getById(Program,data.id_program);
        const enrollment = await this.getById(Enrollment,data.id_Enrollment);
        
        if(!program){
            return {error:"Program not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        if(!enrollment){
            return {error:"Student not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        /*
        const assignment = await AppDataSource.createQueryBuilder(Program,"program")
        //.leftJoinAndSelect(AssignmentGrade, "assignment", "AssignmentGrade.id_program = program.id")
        .leftJoinAndSelect(AssignmentGrade, "assignment", "AssignmentGrade.id_program = program.id")
        .getMany();
        //const assignment = await this.getById(Assignment, program.id);
        */
        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

}