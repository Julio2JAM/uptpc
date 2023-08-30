import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeepPartial, ObjectLiteral, OneToOne, JoinColumn, Index} from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";
import { Program } from "./program.model";
import { Enrollment } from "./enrollment.model";
//import { Evaluation } from "./Evaluation.model";
//import AppDataSource from "../database/database";
import { HTTP_STATUS } from "../Base/statusHttp";

interface  SubjectGradeI{
    id: number,
    program: Program,
    enrollment: Enrollment,
    grade: number,
    id_status: number
}

@Entity()
export class SubjectGrade{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Program, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({name: "id_program"})
    @Index("subject_grade_FK_1")
    @IsNotEmpty({message: "Subject, professor and classroom are required"})
    program: Program;

    @OneToOne(() => Enrollment, { nullable: false, createForeignKeyConstraints: true })
    @JoinColumn({name: "id_enrollment"})
    @Index("subject_grade_FK_2")
    @IsNotEmpty({message: "The enrollment is required"})
    enrollment: Enrollment;

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

    constructor(data:SubjectGradeI) {
        this.program = data?.program;
        this.enrollment = data?.enrollment;
        this.grade = data?.grade;
        this.id_status = data?.id_status;
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
            return {error:"Enrollment not found", status:HTTP_STATUS.BAD_RESQUEST}
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
            return {error:"Enrollment not found", status:HTTP_STATUS.BAD_RESQUEST}
        }
        /*
        const assignment = await AppDataSource.createQueryBuilder(Program,"program")
        //.leftJoinAndSelect(Evaluation, "assignment", "Evaluation.id_program = program.id")
        .leftJoinAndSelect(Evaluation, "assignment", "Evaluation.id_program = program.id")
        .getMany();
        //const assignment = await this.getById(Assignment, program.id);
        */
        const subjectGrade = await this.create(SubjectGrade,data);
        return {subjectGrade, status:HTTP_STATUS.CREATED};
    }

}