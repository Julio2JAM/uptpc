//import AppDataSource from "../database/database"
import { Model } from "../Base/model";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsNotEmpty,MinLength,MaxLength } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 16, nullable: false})
    @IsNotEmpty({message: "Please enter a username"})
    username: string

    @Column({type: 'varchar', length: 16, nullable: false})
    @MinLength(8,{message: "The password must be bigger than 8 caracteres"})
    @MaxLength(16,{message: "The password must be smaller than 16 caracteres"})
    password: string

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.id_status = 1;
    }
}

export class UserModel extends Model {
    
}