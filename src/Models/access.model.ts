import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, DeepPartial, ObjectLiteral } from "typeorm";
import { HTTP_STATUS } from "../Base/statusHttp";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { User } from "./user.model";
import AppDataSource from "../database/database";

@Entity()
export class Access{

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    datetime!: Date;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "idUser"})
    @Index("access_FK_1", { synchronize: false })
    @IsNotEmpty({message: "User is required"})
    id_user!: User;

    constructor(user: User){
        this.id_user = user;
    }
}

export class AccessModel extends Model {

    async post_validate(data:DeepPartial<ObjectLiteral>): Promise<ObjectLiteral>{
        const user = await AppDataSource.manager
            .createQueryBuilder(User, "user")
            .where("username = :username", {username: data.body.username})
            .where("password = :password", {password: data.body.password})
            .getOne();

        if(!user){
            return {error: "User not found", status: HTTP_STATUS.BAD_RESQUEST};
        }

        const newAcess = new Access(user);
        const access = await this.create(Access, newAcess);
        return {access, status: HTTP_STATUS.CREATED}
    }

}