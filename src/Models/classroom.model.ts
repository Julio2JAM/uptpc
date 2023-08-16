import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ObjectLiteral } from "typeorm";
import { IsNotEmpty,  } from "class-validator";
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

interface ClassroomI{
    id: number,
    name: string,
    datetime_start:Date,
    datetime_end:Date,
    id_status:number
}

@Entity()
export class Classroom{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", nullable: false, length: 20})
    @IsNotEmpty({message:"The section is required"})
    name: string;

    @Column({type:"date", nullable: true})
    datetime_start:Date;
    
    @Column({type:"date", nullable: true})
    datetime_end:Date;
    
    @CreateDateColumn()
    datetime!:Date

    @Column({ type: "tinyint", width: 2, default: 1, nullable: false})
    id_status!:number;

    constructor(data:ClassroomI){
        this.name = data?.name;
        this.datetime_start = data?.datetime_start;
        this.datetime_end = data?.datetime_end;
        this.id_status = data?.id_status;
    }
}

export class ClassroomModel extends Model{

    async getByParams(data:Partial<ClassroomI>):Promise<ObjectLiteral | null>{
        const query = AppDataSource.createQueryBuilder(Classroom, "classroom");

        if(data?.name){
            query.where("classroom.name = :name", {name: data?.name});
        }

        if(data?.id_status){
            query.andWhere("classroom.id_status = :id_status", {id_status: data?.id_status});
        }
        
        const classroom = await query.getMany();
        return classroom;
    }

}