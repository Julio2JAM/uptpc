import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, Column } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { User } from "./user.model";

interface AccessI{
    token: string,
    user: User
}

@Entity()
export class Access{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", nullable:false, length:200})
    @IsNotEmpty({message:"Access requires a token"})
    token: string;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "idUser"})
    @Index("access_FK_1", { synchronize: false })
    @IsNotEmpty({message: "User is required"})
    user: User;

    @CreateDateColumn()
    datetime!: Date;

    constructor(data: AccessI){
        this.user = data?.user;
        this.token = data?.token;
    }
}

export class AccessModel extends Model {

}