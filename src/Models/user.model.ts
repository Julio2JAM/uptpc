import { Model } from "../Base/model";
import { Entity, PrimaryGeneratedColumn, Column, ObjectLiteral, ManyToOne, Index, JoinColumn } from "typeorm"
import { IsNotEmpty } from 'class-validator';
import AppDataSource from "../database/database";
import { Level } from "./level.model";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Level, {nullable: true})
    @IsNotEmpty({message: "Level is requiered"})
    @JoinColumn({name: "id_level"})
    @Index("user_fk_1")
    level!: Level

    @Column({type: 'varchar', length: 16, nullable: false, unique:true})
    @IsNotEmpty({message: "Please enter a username"})
    username: string

    @Column({type: 'varchar', length: 80, nullable: false})
    password: string

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(data:Map<any, any>) {
        this.level = data?.get("level");
        this.username = data?.get("username");
        this.password = data?.get("password");
        this.id_status = 1;
    }
}

export class UserModel extends Model {

    async getByUsername(username:String):Promise<ObjectLiteral | null>{
        const user = await AppDataSource.manager
            .createQueryBuilder(User, "user")
            //.select("username")
            .where("username = :username", {username: username})
            //.getRawOne();
            .getOne();

        return user;
    }

}