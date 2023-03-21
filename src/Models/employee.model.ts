//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IsNotEmpty,IsNumber,IsDate,IsString,IsEmail,IsOptional} from 'class-validator';
import { Model } from "../Base/model";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'tinyint', nullable: true})
    @IsOptional()
    @IsNumber()
    id_profession: number

    @Column({ type:'int', unique:true, nullable:false, width:12})
    @IsNotEmpty({"message": "The C.I is obligatory"})
    @IsNumber()
    cedule: number

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsOptional()
    @IsString()
    name: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsOptional()
    @IsString()
    lastName: string

    @Column({ type: 'varchar', nullable: true, length: 14})
    @IsOptional()
    @IsString()
    phone: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsOptional()
    @IsEmail()
    email: string

    @Column({ type: 'date' })
    @IsDate()
    birthday: Date

    @CreateDateColumn()
    datetime!: Date

    @Column({ type: 'tinyint', nullable: false, width: 2, default: 1})
    id_status!: number

    constructor(dataEmployee:Map<any,any>){
        this.id_profession = dataEmployee?.get("id_profession")
        this.cedule = dataEmployee?.get("cedule");
        this.name = dataEmployee?.get("name");
        this.lastName = dataEmployee?.get("lastName");
        this.phone = dataEmployee?.get("phone");
        this.email = dataEmployee?.get("email");
        this.birthday = dataEmployee?.get("birthday");
        this.id_status = 1;
    }
}

export class EmployeeModel extends Model {

}