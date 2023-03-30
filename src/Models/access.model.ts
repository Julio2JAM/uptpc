import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { HTTP_STATUS } from "../Base/statusHttp";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { User } from "./user.model";

@Entity()
export class Access{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "int", nullable: false})
    @IsNotEmpty({message: "User is required"})
    id_user: number;

    @CreateDateColumn()
    datetime!: Date;

    constructor(id_user: number){
        this.id_user = id_user;
    }
}

export class AccessModel extends Model {

    async post_validate(id:Number): Promise<Object>{
        const user = await this.getById(User,id);

        if(!user){
            return {error: "User not found", status: HTTP_STATUS.BAD_RESQUEST};
        }

        const access = await this.create(Access, user);
        return {access, status: HTTP_STATUS.CREATED}
    }

}