import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { MinLength } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'varchar', length: 16, nullable: false})
    username: string

    @Column({type: 'varchar', length: 16, nullable: false})
    @MinLength(30,{message: "Please enter a username"}) //TEST
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