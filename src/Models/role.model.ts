import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "../Base/model";
import { IsNotEmpty } from "class-validator";

interface RoleI{
    name: string,
}

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length:20, nullable:false})
    @IsNotEmpty({message: "Name not specified"})
    name: string;

    @Column({type:"int", width:2, nullable:false, default:1})
    id_status!: number;

    constructor(data:RoleI){
        this.name = data?.name;
    }
}

export class RoleModel extends Model {

}