import { Model } from "../Base/model";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinColumn, OneToOne } from "typeorm"
import { IsNotEmpty, MinLength } from 'class-validator';
import { Role } from "./role.model";
import { Person } from "./person.model";

interface LevelI{
    id: number,
    role: Role,
    username: string,
    password: string,
    person: Person;
    id_status: number
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Role, {nullable: true})
    @JoinColumn({name: "id_role"})
    @Index("user_fk_1")
    role: Role

    @Column({type: 'varchar', length: 16, nullable: false, unique:true})
    @IsNotEmpty({message: "Please enter a username"})
    @MinLength(4)
    username: string

    @Column({type: 'varchar', length: 80, nullable: false})
    password: string

    @OneToOne(() => Person, {nullable: true, createForeignKeyConstraints: true})
    @JoinColumn({name: "id_person"})
    @Index("user_FK_2")
    person: Person

    @Column({type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status: number

    constructor(data:LevelI) {
        this.role = data?.role;
        this.username = data?.username;
        this.password = data?.password;
        this.person = data?.person;
        this.id_status = data?.id_status;
    }
}

export class UserModel extends Model {

}