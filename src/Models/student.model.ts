//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IsNotEmpty,IsNumber,IsDate,IsString,IsEmail,IsOptional} from 'class-validator';
import { Model } from "../Base/model";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'int', unique:true, nullable: false, width: 12})
    @IsNotEmpty({"message": "The C.I is obligatory"})
    @IsNumber()
    cedule: number

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsString()
    @IsOptional()
    name: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsString()
    @IsOptional()
    lastName: string

    @Column({ type: 'varchar', nullable: true, length: 14})
    @IsString()
    @IsOptional()
    phone: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsEmail()
    @IsOptional()
    email: string

    @Column({ type: 'date', default: null})
    @IsDate()
    birthday: Date

    @CreateDateColumn()
    datetime!: Date

    @Column({ type: 'tinyint', width: 2, default: 1, nullable: false})
    id_status!: number

    constructor(dataStudent:Map<any,any>) {
        this.cedule     = dataStudent?.get('cedule');
        this.name       = dataStudent?.get("name");
        this.lastName   = dataStudent?.get("lastName");
        this.phone      = dataStudent?.get("phone");
        this.email      = dataStudent?.get("email");
        this.birthday   = new Date(dataStudent?.get("birthday"));
        this.id_status  = 1;
    }
}

export class StudentModel extends Model {

}