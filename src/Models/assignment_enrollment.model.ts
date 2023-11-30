//Entity
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, Index, UpdateDateColumn, OneToOne } from "typeorm";
import { IsNotEmpty } from "class-validator";
//Models
import { Model } from "../Base/model";
import { Enrollment } from "./enrollment.model";
import { Assignment } from "./assignment.model";

interface Assignment_enrollmentI{
    enrollment: Enrollment,
    assignment: Assignment,
    status: number,
}

@Entity()
export class Assignment_enrollment{
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => Enrollment)
    @JoinColumn({name: "id_enrollment"})
    @Index("ae_FK_1")
    @IsNotEmpty({message: "Please enter a enrollment"})
    enrollment!: Enrollment;

    @OneToOne(() => Assignment)
    @JoinColumn({name: "id_assignment"})
    @Index("ae_FK_2")
    @IsNotEmpty({message: "Please enter an assignment"})
    assignment!: Assignment;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_updated!: Date;

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(data:Assignment_enrollmentI){
        this.enrollment = data?.enrollment;
        this.assignment = data?.assignment;
        this.id_status = data?.status;
    }
}

export class Assignment_enrollmentModel extends Model {

}