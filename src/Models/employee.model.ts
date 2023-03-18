//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { IsNotEmpty,IsNumber,IsDate,IsString,IsEmail} from 'class-validator';

@Entity()
export class employee {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: 'tinyint', nullable: true})
    @IsNumber()
    id_profession!: number

    @Column({ type: 'int', nullable: false, width: 12})
    @IsNotEmpty({"message": "The C.I is obligatory"})
    @IsNumber()
    cedule: number

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsString()
    name: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsString()
    lastName: string

    @Column({ type: 'varchar', nullable: true, length: 14})
    @IsString()
    phone: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    @IsEmail()
    email: string

    @Column({ type: 'date' })
    @IsDate()
    birthday: Date

    @Column({ type: 'date' })
    datetime!: Date

    @Column({ type: 'tinyint', nullable: false, width: 2, default: 1})
    id_status!: number

    constructor(cedule: number, name: string, lastName: string, phone: string, email: string, birthday: Date) {
        this.cedule = cedule;
        this.name = name;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.birthday = birthday;
        this.id_status = 1;
    }
}