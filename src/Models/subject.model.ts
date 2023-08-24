//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, ObjectLiteral, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Allow, IsInt, IsNotEmpty, IsOptional, IsString, } from 'class-validator';
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

export interface SubjectI{
    id: number,
    name: string,
    description: string,
    status: number
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
        this.id_status = data?.status;
    }
}

export class SubjectModel extends Model{

    async getByParams(data:Partial<SubjectI>):Promise<ObjectLiteral | null> {
        const query = AppDataSource.createQueryBuilder(Subject,"subject");

        if(data?.name){
            query.where("subject.name LIKE :name",{name:`%${data?.name}%`});
        }

        if(data?.description){
            query.andWhere("subject.description LIKE :status",{status:`%${data?.description}%`});
        }

        if(data?.status){
            query.andWhere("subject.id_status = :status",{status:data?.status});
        }

        const subject = await query.getMany();
        return subject;
    }

}