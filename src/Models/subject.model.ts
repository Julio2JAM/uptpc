//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, ObjectLiteral, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

interface SubjectI{
    id: number,
    name: string,
    description: string,
    status: number
}

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 16, nullable: false})
    @IsNotEmpty({message: "Please enter a name"})
    name: string
    
    @Column({type: 'varchar', length:255, nullable: true})
    @IsOptional()
    description: string

    @CreateDateColumn()
    datetime!: Date

    @UpdateDateColumn()
    datetime_update!: Date

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(data:SubjectI) {
        this.name = data?.name;
        this.description = data?.description;
        this.id_status = data?.status ?? 1;
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