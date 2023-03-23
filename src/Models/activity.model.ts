import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeepPartial, ObjectLiteral, } from "typeorm";
import { IsNotEmpty, IsNumber, IsOptional, IsInt, Min, Max, IsPositive } from "class-validator";
import { ClassroomProfessor } from "./classroomProfessor.model";
import { Model } from "../Base/model";
import { HTTP_STATUS } from "../Base/statusHttp";

@Entity()
export class Activity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", nullable: false})
    @IsNotEmpty({message:"Please enter a classroom, professor and subject"})
    @IsNumber()
    @IsInt({message:"The classroom is not available"})
    id_classroomProfessor: number;

    @Column({type:'varchar', length:60, nullable:false})
    @IsNotEmpty({message:"The name of the activity is not specified"})
    name: string;

    @Column({type:'varchar', length:255, nullable:true})
    @IsNotEmpty({message:"The description of the activity is not specified"})
    description: string;

    @Column({type:'tinyint', width:3, nullable:false})
    @IsNotEmpty({message:"The porcentage of the activity is required"})
    @IsNumber()
    @IsInt({message:"The porcentage is not numeric"})
    @Min(1,{message:"The porcentage must be greater than 0"})
    @Max(100,{message:"The porcentage must be less than 100"})
    porcentage: number;

    @Column({type:'tinyint', width:3, nullable:true})
    @IsOptional()
    @IsNumber()
    @IsPositive({message: 'The porcentage must be greater than 0'})
    @IsInt({message:"The quantity is not numeric"})
    quantity: number;

    @Column({type:'date', nullable:true})
    @IsOptional()
    datetime_end: Date;

    @CreateDateColumn()
    datetime!: Date;

    @Column({type:'tinyint', width:2 ,default:1})
    id_status!: number

    constructor(dataActivity:Map<any,any>){
        this.id_classroomProfessor = dataActivity?.get('id_classroomProfessor');
        this.name = dataActivity?.get('name');
        this.description = dataActivity?.get('description');
        this.porcentage = dataActivity?.get('porcentage');
        this.quantity = dataActivity?.get('quantity');
        this.datetime_end = dataActivity?.get('datetime_end');
    }
}

export class ActivityModel extends Model {

    async post_validation(data:DeepPartial<ObjectLiteral>){
        const classroomProfessor = await this.getById(ClassroomProfessor,data.id_classroomProfessor);
        if(!classroomProfessor){
            return {error: "The classroom, professor and subject was not found", status: HTTP_STATUS.BAD_RESQUEST};
        }
        const activity = await this.create(Activity, data);
        return {activity, status: HTTP_STATUS.CREATED};
    }

}