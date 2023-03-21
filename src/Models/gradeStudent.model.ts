import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { IsNotEmpty, IsInt } from "class-validator";
import { Model } from "../Base/model";

@Entity()
export class GradeStudent{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty()
    @IsInt()
    id_grade!: number;

    @Column({type:"int", nullable:false, width:11})
    @IsNotEmpty()
    @IsInt()
    id_student!: number;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:"tinyint", nullable:false, width:3, default:1})
    id_status!: number;

    constructor(data:Map<any, any>) {
        this.id_grade = data?.get("id_grade");
        this.id_status = data?.get("id_status");
    }
}

export class GradeStudentModel extends Model{

}