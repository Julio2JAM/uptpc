//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 30, nullable: false})
    @IsNotEmpty({message: "Please enter a name"})
    name: string

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(name: string) {
        this.name = name;
        this.id_status = 1;
    }
}