import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { IsNotEmpty,  } from "class-validator";
import { Model } from "../Base/model";

@Entity()
export class Grade{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", nullable: false, length: 20})
    @IsNotEmpty({message:"The section is required"})
    seccion!: string;

    @Column({type:"date", nullable: true})
    datetime_start!:Date;
    
    @Column({type:"date", nullable: true})
    datetime_end!:Date;
    
    @CreateDateColumn()
    datetime!:Date

    @Column({type:"tinyint", default: "1", nullable: false})
    id_status!:number;

    constructor(dataGrade:Map<any,any>){
        this.seccion = dataGrade?.get("seccion");
        this.datetime_start = dataGrade?.get("datetime_start");
        this.datetime_end = dataGrade?.get("datetime_end");
    }
}

export class GradeModel extends Model{

}