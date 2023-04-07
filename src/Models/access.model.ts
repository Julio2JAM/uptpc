import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index, Column } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Model } from "../Base/model";
import { User } from "./user.model";

@Entity()
export class Access{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", nullable:false, length:200})
    @IsNotEmpty({message:"Access requires a token"})
    token!: string;

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: "idUser"})
    @Index("access_FK_1", { synchronize: false })
    @IsNotEmpty({message: "User is required"})
    id_user!: User;

    @CreateDateColumn()
    datetime!: Date;

    constructor(data:Map<any, any>){
        this.id_user = data?.get("user");
        this.token = data?.get("token");
    }
}

export class AccessModel extends Model {

}