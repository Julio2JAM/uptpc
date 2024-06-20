import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, UpdateDateColumn, ObjectLiteral, Unique } from "typeorm";
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
@Unique(["classroom", "student"])
export class Enrollment{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Classroom, {nullable: false})
    @JoinColumn({name: "id_classroom"})
    @Index("enrollment_FK_1")
    @IsNotEmpty({message: "Please enter a classroom"})
    classroom: Classroom;

    @ManyToOne(() => Student, {nullable:false})
    @JoinColumn({name:"id_student"})
    @Index("enrollment_FK_2")
    @IsNotEmpty({message: "Please enter a person"})
    student: Student;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status: number;

    constructor(data:EnrollmentI) {
        this.classroom = data?.classroom;
        this.student = data?.student;
        this.id_status = data?.id_status ?? 1;
    }
}

export class EnrollmentModel extends Model{

    async studentNoClassroom(): Promise<ObjectLiteral | null> {

        const Students = await AppDataSource.createQueryBuilder(Student, "student")
        .leftJoinAndSelect("student.person", "person")
        .leftJoinAndSelect("student.representative1", "representative1")
        .leftJoinAndSelect("student.representative2", "representative2")
        .leftJoinAndSelect("enrollment", "enrollment", "enrollment.id_student = student.id")
        //.where("enrollment.id IS NULL")
        .getMany();

        return Students;

    }
}