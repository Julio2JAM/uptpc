import AppDataSource from "../database/database"
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

export class UserModel{
    
    async get():Promise<User[]>{
        console.log("getting users");
        return await AppDataSource.manager.find(User);
    }

    async getById(id:Number):Promise<User | null>{
        console.log("getting user by id");
        return await AppDataSource.manager.findOneBy(User,{"id":Number(id)});
    }
    
    async create(user:User):Promise<User>{
        console.log("creating a new user");
        return await AppDataSource.manager.save(User,user);
    }
}