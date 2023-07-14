//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ObjectLiteral } from "typeorm"
import { IsNotEmpty, IsNumber, IsDate, IsString, IsEmail, IsOptional, IsInt} from 'class-validator';
import { Model } from "../Base/model";
import AppDataSource from "../database/database";

interface StudentI{
    id?: number,
    cedule?: number,
    name: string,
    lastName: string,
    phone: string,
    email: string,
    birthday: Date,
    id_status: number
}

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'int', unique:true, nullable: false, width: 12})
    @IsNotEmpty({"message": "The C.I is obligatory"})
    @IsNumber()
    @IsInt({message:"The C.I is not available"})
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

    constructor(data:StudentI) {
        this.cedule     = Number(data?.cedule);
        this.name       = data?.name;
        this.lastName   = data?.lastName;
        this.phone      = String(parseInt(data?.phone));
        this.email      = data?.email;
        this.birthday   = new Date(data?.birthday);
        this.id_status  = 1;
    }
}

export class PersonModel extends Model {

    async getByCedule(cedule:Number):Promise<ObjectLiteral | null> {
        const person = await AppDataSource.manager
        .createQueryBuilder(Person, "person")
        .where("person.cedule = :cedule", {cedule:cedule})
        //.where("person.cedule LIKE :cedule", {cedule:`%${cedule}%`})
        .getOne();

        return person;
    }

}