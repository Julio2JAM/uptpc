import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "../Base/model";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Role{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:"varchar", length:20, nullable:false})
    @IsNotEmpty({message: "Name not specified"})
    name: string;

    @Column({type:"int", width:2, nullable:false, default:1})
    id_status!: number;

    constructor(name:string){
        this.name = name;
    }
}

export class RoleModel extends Model {

}