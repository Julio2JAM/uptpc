import { Model } from "../Base/model";
import { Entity, PrimaryGeneratedColumn, Column, DeepPartial, ObjectLiteral } from "typeorm"
import { IsNotEmpty,MinLength,MaxLength,IsNumber } from 'class-validator';
import AppDataSource from "../database/database";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type:"tinyint", width: 3, nullable: false})
    @IsNumber()
    @IsNotEmpty({message: "Level is requiered"})
    id_level!: number

    @Column({type: 'varchar', length: 16, nullable: false, unique:true})
    @IsNotEmpty({message: "Please enter a username"})
    username: string

    @Column({type: 'varchar', length: 16, nullable: false})
    @MinLength(8,{message: "The password must be bigger than 8 caracteres"})
    @MaxLength(16,{message: "The password must be smaller than 16 caracteres"})
    password: string

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(data:Map<any, any>) {
        this.id_level = 1;//id_level;
        this.username = data?.get("username");
        this.password = data?.get("password");
        this.id_status = 1;
    }
}

export class UserModel extends Model {
    
    async login(data:DeepPartial<ObjectLiteral>): Promise<ObjectLiteral | null>{
        const user = await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("username = :username", {username: data.body.username})
            .where("password = :password", {password: data.body.password})
            .getOne();
            
        return user;
    }

}