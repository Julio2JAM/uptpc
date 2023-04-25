//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, ObjectLiteral, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Model } from "../Base/model";
import AppDataSource from "../database/database";
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

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.id_status = 1;
    }
}

export class SubjectModel extends Model{

    async getByName(name: string): Promise<ObjectLiteral | null>{

        const subject = await AppDataSource.createQueryBuilder(Subject,"subject")
        .where("subject.name = :name", {name: name})
        .getOne();

        return subject;
    }

}