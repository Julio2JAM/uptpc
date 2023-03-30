import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { HTTP_STATUS } from "../Base/statusHttp";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { User } from "./user.model";

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

    async post_validate(id:Number): Promise<Object>{
        const user = await this.getById(User,id);

        if(!user){
            return {error: "User not found", status: HTTP_STATUS.BAD_RESQUEST};
        }

        const access = await this.create(Access, user);
        return {access, status: HTTP_STATUS.CREATED}
    }

}