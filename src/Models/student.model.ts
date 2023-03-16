//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class student {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'int', nullable: false, width: 12})
    cedule!: number

    @Column({ type: 'varchar', nullable: true, length: 60})
    name!: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    lastName!: string

    @Column({ type: 'varchar', nullable: true, length: 14})
    phone!: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    email!: string

    @Column({ type: 'date' })
    birthday!: Date

    @Column({ type: 'date' })
    datetime!: Date

    @Column({ type: 'tinyint', width: 2, default: 1, nullable: false})
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