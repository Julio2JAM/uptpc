import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { IsNotEmpty,  } from "class-validator";
import { Model } from "../Base/model";

@Entity()
export class Classroom{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", nullable: false, length: 20})
    @IsNotEmpty({message:"The section is required"})
    seccion: string;

    @Column({type:"date", nullable: true})
    datetime_start!:Date;
    
    @Column({type:"date", nullable: true})
    datetime_end!:Date;
    
    @CreateDateColumn()
    datetime!:Date

    @Column({type:"tinyint", default: "1", nullable: false})
    id_status!:number;

    constructor(dataClassroom:Map<any,any>){
        this.seccion = dataClassroom?.get("seccion");
        this.datetime_start = dataClassroom?.get("datetime_start");
        this.datetime_end = dataClassroom?.get("datetime_end");
    }
}

export class ClassroomModel extends Model{

}