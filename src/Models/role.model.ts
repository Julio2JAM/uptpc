import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "../Base/model";
import { IsNotEmpty } from "class-validator";

interface RoleI{
    name: string,
    code: string,
}

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length:20, nullable:false, unique:true})
    @IsNotEmpty({message: "Code not specified"})
    code!: string;

    @Column({type:"varchar", length:20, nullable:false})
    @IsNotEmpty({message: "Name not specified"})
    name: string;

    @Column({type:"int", width:2, nullable:false, default:1})
    id_status!: number;

    constructor(data:RoleI){
        this.name = data?.name.toUpperCase();
        this.code = data?.code.toUpperCase();
    }
}

export class RoleModel extends Model {

}