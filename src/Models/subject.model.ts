//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Allow, IsInt, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { Model } from "../Base/model";

export interface SubjectI{
    id: number,
    name: string,
    description: string,
    id_status: number
}

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    @Allow() //* Permite que el validador lo tome como valido, ya que es decorador para cuando no se tienen otros decoradores
    id!: number;

    @Column({type: 'varchar', length: 16, nullable: false})
    @IsString()
    @IsNotEmpty({message: "Name is not specified"})
    name: string;
    
    @Column({type: 'varchar', length:255, nullable: true})
    @IsString()
    @IsOptional()
    description: string;

    @CreateDateColumn()
    datetime!: Date;

    @UpdateDateColumn()
    datetime_update!: Date;

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    @IsInt()
    @IsOptional()
    id_status: number;

    constructor(data:SubjectI) {
        this.name = data?.name;
        this.description = data?.description;
        this.id_status = data?.id_status;
    }
}

export class SubjectModel extends Model{

}