import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn, ObjectLiteral } from "typeorm";
import { Classroom } from "./classroom.model";
import { Student } from "./student.model";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

interface EnrollmentI{
    id?: number,
    classroom: Classroom,
    student: Student,
    id_status?: number
}

@Entity()
export class Enrollment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("Enrollment_FK_1")
    @IsNotEmpty({message: "Please enter a classroom"})
    classroom: Classroom;

    @ManyToOne(() => Student, {nullable:false})
    @JoinColumn({name:"id_student"})
    @Index("Enrollment_FK_2")
    @IsNotEmpty({message: "Please enter a person"})
    student: Student;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status: number;

    constructor(data:EnrollmentI) {
        this.classroom = data?.classroom;
        this.student = data?.student;
        this.id_status = data?.id_status ?? 1;
    }
}

export class EnrollmentModel extends Model{

    async getByParams(data: Map<string, any>): Promise<ObjectLiteral> {

        const query = AppDataSource.createQueryBuilder(Enrollment, "enrollment");

        if(data?.get("classroom")){
            query.where("enrollment.id_classroom = :classroom", {classroom: data?.get("classroom")});
        }

        if(data?.get("student")){
            query.andWhere("enrollment.id_student = :student", {student: data?.get("student")});
        }

        const enrollment = await query.leftJoinAndSelect('enrollment.student', 'student')
        //.leftJoinAndMapOne("enrollment.student", student, "student", "enrollment.id_student = student.id")
        .leftJoinAndSelect('enrollment.classroom', 'classroom')
        //.leftJoinAndMapOne("enrollment.classroom", Classroom, "classroom", "enrollment.id_classroom = classroom.id")
        .getMany();

        return enrollment;

    }
/*
    async getEnrollment(student: ObjectLiteral): Promise<ObjectLiteral | null> {
        
        const enrollment = await AppDataSource.createQueryBuilder(Enrollment, "enrollment")
        .leftJoinAndSelect("program", "program", "enrollment.id_classroom = program.id_classroom")
        //.where("enrollment.id_student = :student", {student: 1})
        .getMany();

        return enrollment;

    }
*/
    async getStudent(): Promise<ObjectLiteral | null> {

        const Students = await AppDataSource.createQueryBuilder(Student, "Student")
        .leftJoinAndSelect("Student.enrollments", "enrollment")
        .getMany();

        return Students;

    }
}